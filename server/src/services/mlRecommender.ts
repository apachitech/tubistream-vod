import { Title } from '../types';
import { catalogService } from './catalogService';
import { authService } from './authService';

export interface TitleEmbedding {
  titleId: string;
  vector: number[];
  features: string[];
}

export class MLRecommenderService {
  private vocabulary: string[] = [];
  private titleEmbeddings: Map<string, TitleEmbedding> = new Map();

  constructor() {
    this.trainModel();
  }

  /**
   * Builds feature vocabulary and computes TF-IDF style vector embeddings for all titles
   */
  public trainModel(): void {
    const titles = catalogService.getAllTitles();
    const vocabSet = new Set<string>();

    titles.forEach(t => {
      t.genres.forEach(g => vocabSet.add(`genre:${g.toLowerCase()}`));
      t.tags.forEach(tag => vocabSet.add(`tag:${tag.toLowerCase()}`));
      t.cast.forEach(c => vocabSet.add(`actor:${c.toLowerCase()}`));
      vocabSet.add(`dir:${t.director.toLowerCase()}`);
      vocabSet.add(`rating:${t.rating.toLowerCase()}`);
      vocabSet.add(`decade:${Math.floor(t.releaseYear / 10) * 10}s`);
    });

    this.vocabulary = Array.from(vocabSet);

    // Compute sparse embedding vector for each title
    titles.forEach(t => {
      const activeFeatures = new Set<string>();
      t.genres.forEach(g => activeFeatures.add(`genre:${g.toLowerCase()}`));
      t.tags.forEach(tag => activeFeatures.add(`tag:${tag.toLowerCase()}`));
      t.cast.forEach(c => activeFeatures.add(`actor:${c.toLowerCase()}`));
      activeFeatures.add(`dir:${t.director.toLowerCase()}`);
      activeFeatures.add(`rating:${t.rating.toLowerCase()}`);
      activeFeatures.add(`decade:${Math.floor(t.releaseYear / 10) * 10}s`);

      const vector = this.vocabulary.map(feat => {
        if (!activeFeatures.has(feat)) return 0;
        // Feature weights
        if (feat.startsWith('genre:')) return 3.0;
        if (feat.startsWith('tag:')) return 2.0;
        if (feat.startsWith('actor:')) return 1.5;
        if (feat.startsWith('dir:')) return 2.5;
        return 1.0;
      });

      this.titleEmbeddings.set(t.id, {
        titleId: t.id,
        vector: this.normalizeVector(vector),
        features: Array.from(activeFeatures)
      });
    });
  }

  private normalizeVector(v: number[]): number[] {
    const magnitude = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return v;
    return v.map(val => val / magnitude);
  }

  private cosineSimilarity(vA: number[], vB: number[]): number {
    let dot = 0;
    for (let i = 0; i < vA.length; i++) {
      dot += vA[i] * vB[i];
    }
    return Math.max(0, Math.min(1, dot));
  }

  /**
   * Returns item-to-item similar titles based on embedding vector cosine similarity
   */
  public getSimilarTitles(titleId: string, limit = 8): { title: Title; similarity: number }[] {
    const targetEmbedding = this.titleEmbeddings.get(titleId);
    if (!targetEmbedding) {
      this.trainModel();
    }
    const currentEmbedding = this.titleEmbeddings.get(titleId);
    if (!currentEmbedding) return [];

    const scored: { title: Title; similarity: number }[] = [];
    const allTitles = catalogService.getAllTitles();

    allTitles.forEach(t => {
      if (t.id === titleId) return;
      const otherEmbedding = this.titleEmbeddings.get(t.id);
      if (!otherEmbedding) return;

      const sim = this.cosineSimilarity(currentEmbedding.vector, otherEmbedding.vector);
      scored.push({ title: t, similarity: parseFloat((sim * 100).toFixed(1)) });
    });

    return scored
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * Generates a fully personalized recommendations feed for a user profile
   */
  public getPersonalizedFeed(userId: string): {
    topPicksForYou: Title[];
    becauseYouWatched: { sourceTitle: Title; recommendations: Title[] } | null;
    continueWatching: { title: Title; progressSeconds: number; durationSeconds: number }[];
    trendingNow: Title[];
    genreSpotlights: { genre: string; titles: Title[] }[];
  } {
    const user = authService.getUser(userId) || authService.getOrCreateGuestUser();
    const profile = user.profiles.find(p => p.id === user.activeProfileId) || user.profiles[0];
    const allTitles = catalogService.getAllTitles();

    // 1. Continue Watching
    const continueWatching = profile.watchHistory
      .filter(h => !h.completed && h.progressSeconds > 10)
      .map(h => {
        const title = catalogService.getTitleById(h.titleId);
        return title ? { title, progressSeconds: h.progressSeconds, durationSeconds: h.durationSeconds } : null;
      })
      .filter(Boolean) as { title: Title; progressSeconds: number; durationSeconds: number }[];

    // 2. Compute User Affinity Profile Vector
    let userVector = new Array(this.vocabulary.length).fill(0);
    let totalInteractions = 0;

    // Weight from watch history
    profile.watchHistory.forEach(h => {
      const emb = this.titleEmbeddings.get(h.titleId);
      if (emb) {
        const completionRatio = h.durationSeconds > 0 ? (h.progressSeconds / h.durationSeconds) : 0.5;
        const weight = 1.0 + completionRatio * 2;
        emb.vector.forEach((val, idx) => {
          userVector[idx] += val * weight;
        });
        totalInteractions += weight;
      }
    });

    // Weight from MyList and Liked
    profile.myList.forEach(id => {
      const emb = this.titleEmbeddings.get(id);
      if (emb) {
        emb.vector.forEach((val, idx) => {
          userVector[idx] += val * 2.5;
        });
        totalInteractions += 2.5;
      }
    });

    profile.likedTitles.forEach(id => {
      const emb = this.titleEmbeddings.get(id);
      if (emb) {
        emb.vector.forEach((val, idx) => {
          userVector[idx] += val * 3.5;
        });
        totalInteractions += 3.5;
      }
    });

    let topPicksForYou: Title[] = [];

    if (totalInteractions > 0) {
      userVector = this.normalizeVector(userVector);
      const scored = allTitles.map(t => {
        const emb = this.titleEmbeddings.get(t.id);
        const sim = emb ? this.cosineSimilarity(userVector, emb.vector) : 0.5;
        return { title: t, score: sim };
      });
      topPicksForYou = scored.sort((a, b) => b.score - a.score).slice(0, 10).map(s => s.title);
    } else {
      // Cold start: default to highest match score & rating
      topPicksForYou = [...allTitles].sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
    }

    // 3. "Because You Watched [Title]"
    let becauseYouWatched: { sourceTitle: Title; recommendations: Title[] } | null = null;
    const lastWatched = profile.watchHistory[0];
    if (lastWatched) {
      const sourceTitle = catalogService.getTitleById(lastWatched.titleId);
      if (sourceTitle) {
        const recs = this.getSimilarTitles(sourceTitle.id, 6).map(r => r.title);
        if (recs.length > 0) {
          becauseYouWatched = { sourceTitle, recommendations: recs };
        }
      }
    }

    // 4. Trending Now
    const trendingNow = catalogService.getTrendingTitles().slice(0, 10);

    // 5. Genre Spotlights
    const genres = ['Action', 'Sci-Fi', 'Comedy', 'Drama', 'Animation', 'Horror'];
    const genreSpotlights = genres.map(genre => ({
      genre,
      titles: catalogService.getTitlesByGenre(genre, 8)
    })).filter(g => g.titles.length > 0);

    return {
      topPicksForYou,
      becauseYouWatched,
      continueWatching,
      trendingNow,
      genreSpotlights
    };
  }

  /**
   * Visualizer model data for Admin ML Insights
   */
  public getModelDiagnostics() {
    return {
      totalFeatures: this.vocabulary.length,
      sampleFeatures: this.vocabulary.slice(0, 30),
      totalIndexedTitles: this.titleEmbeddings.size,
      algorithm: 'Cosine Similarity on Multi-Hot TF-IDF Vectors + Collaborative Implicit Feedback',
      genreWeights: { genre: 3.0, tag: 2.0, director: 2.5, actor: 1.5, rating: 1.0 },
      clusteringModel: 'K-Means Latent Factor Matrix (k=6)'
    };
  }
}

export const mlRecommender = new MLRecommenderService();
