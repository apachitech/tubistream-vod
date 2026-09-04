import { Title } from '../types';
import { catalogService } from './catalogService';

export interface AiSearchResult {
  prompt: string;
  matchedFilters: {
    extractedGenres: string[];
    extractedKeywords: string[];
    minImdbScore?: number;
    yearRange?: string;
  };
  titles: { title: Title; aiExplanation: string; relevanceScore: number }[];
}

export class AiSearchService {
  public parseAndSearch(prompt: string): AiSearchResult {
    const allTitles = catalogService.getAllTitles();
    const p = prompt.toLowerCase();

    const extractedGenres: string[] = [];
    const extractedKeywords: string[] = [];
    let minImdbScore: number | undefined = undefined;

    // Detect Genre intents
    const genreMap = ['action', 'sci-fi', 'comedy', 'drama', 'horror', 'thriller', 'adventure', 'animation', 'documentary', 'crime', 'fantasy'];
    genreMap.forEach(g => {
      if (p.includes(g)) extractedGenres.push(g);
    });

    // Detect keyword intents
    const keywords = ['dragon', 'robot', 'cyberpunk', 'detective', 'space', 'ocean', 'standup', 'medieval', 'heist', 'monster'];
    keywords.forEach(kw => {
      if (p.includes(kw)) extractedKeywords.push(kw);
    });

    // Detect rating intent e.g. "high rating", "top rated", "> 8"
    if (p.includes('high rating') || p.includes('top rated') || p.includes('best') || p.includes('8')) {
      minImdbScore = 8.0;
    }

    const scoredResults: { title: Title; aiExplanation: string; relevanceScore: number }[] = [];

    allTitles.forEach(t => {
      let score = 50; // base score
      const explanations: string[] = [];

      // Genre match
      const matchedG = t.genres.filter(g => extractedGenres.includes(g.toLowerCase()));
      if (matchedG.length > 0) {
        score += matchedG.length * 20;
        explanations.push(`Matched Genre: ${matchedG.join(', ')}`);
      }

      // Keyword match
      const matchedKw = t.tags.filter(tag => p.includes(tag.toLowerCase()));
      if (matchedKw.length > 0) {
        score += matchedKw.length * 15;
        explanations.push(`Matched Theme: ${matchedKw.join(', ')}`);
      }

      // Synopsis fuzzy query match
      const promptWords = p.split(/\s+/).filter(w => w.length > 3);
      const titleText = (t.title + ' ' + t.synopsis + ' ' + t.director + ' ' + t.cast.join(' ')).toLowerCase();
      let wordHits = 0;
      promptWords.forEach(w => {
        if (titleText.includes(w)) wordHits++;
      });

      if (wordHits > 0) {
        score += wordHits * 10;
      }

      // High IMDb rating bonus
      if (minImdbScore && t.imdbScore >= minImdbScore) {
        score += 15;
        explanations.push(`Critically Acclaimed (IMDb ${t.imdbScore})`);
      }

      if (explanations.length === 0) {
        explanations.push('Contextual Relevance Match');
      }

      if (score >= 60 || wordHits > 0 || matchedG.length > 0) {
        scoredResults.push({
          title: t,
          aiExplanation: explanations.join(' • '),
          relevanceScore: Math.min(99, score)
        });
      }
    });

    // Sort by relevance score descending
    scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return {
      prompt,
      matchedFilters: {
        extractedGenres,
        extractedKeywords,
        minImdbScore
      },
      titles: scoredResults.slice(0, 10)
    };
  }
}

export const aiSearchService = new AiSearchService();
