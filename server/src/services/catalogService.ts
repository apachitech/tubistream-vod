import { Title, ContentType } from '../types';
import { SEED_TITLES, SEED_GENRES } from '../data/seedCatalog';

export interface CatalogFilterOptions {
  genre?: string;
  type?: ContentType;
  query?: string;
  rating?: string;
  sortBy?: 'popularity' | 'rating' | 'releaseYear' | 'newest';
  isKidsOnly?: boolean;
  limit?: number;
}

export class CatalogService {
  private titles: Title[] = [];

  constructor() {
    this.titles = [...SEED_TITLES];
  }

  public getAllTitles(): Title[] {
    return this.titles;
  }

  public getTitleById(id: string): Title | undefined {
    return this.titles.find(t => t.id === id || t.slug === id);
  }

  public getFeaturedTitles(): Title[] {
    return this.titles.filter(t => t.isFeatured);
  }

  public getTrendingTitles(): Title[] {
    return this.titles.filter(t => t.isTrending).sort((a, b) => b.totalViews - a.totalViews);
  }

  public getOriginals(): Title[] {
    return this.titles.filter(t => t.isOriginal);
  }

  public getTop10(): Title[] {
    return [...this.titles]
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 10);
  }

  public getGenres(): string[] {
    return SEED_GENRES;
  }

  public getTitlesByGenre(genre: string, limit = 12): Title[] {
    return this.titles
      .filter(t => t.genres.some(g => g.toLowerCase() === genre.toLowerCase()))
      .slice(0, limit);
  }

  public filterTitles(options: CatalogFilterOptions): Title[] {
    let result = [...this.titles];

    if (options.isKidsOnly) {
      result = result.filter(t => ['G', 'PG', 'TV-Y', 'TV-G', 'TV-PG'].includes(t.rating));
    }

    if (options.type) {
      result = result.filter(t => t.type === options.type);
    }

    if (options.genre && options.genre !== 'All') {
      result = result.filter(t => 
        t.genres.some(g => g.toLowerCase() === options.genre!.toLowerCase())
      );
    }

    if (options.rating) {
      result = result.filter(t => t.rating === options.rating);
    }

    if (options.query && options.query.trim() !== '') {
      const q = options.query.toLowerCase().trim();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.synopsis.toLowerCase().includes(q) ||
        t.genres.some(g => g.toLowerCase().includes(q)) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        t.cast.some(c => c.toLowerCase().includes(q)) ||
        t.director.toLowerCase().includes(q)
      );
    }

    if (options.sortBy) {
      switch (options.sortBy) {
        case 'popularity':
          result.sort((a, b) => b.totalViews - a.totalViews);
          break;
        case 'rating':
          result.sort((a, b) => b.imdbScore - a.imdbScore);
          break;
        case 'releaseYear':
          result.sort((a, b) => b.releaseYear - a.releaseYear);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }

    if (options.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  public incrementViews(id: string): void {
    const title = this.getTitleById(id);
    if (title) {
      title.totalViews += 1;
    }
  }

  // --- CMS CRUD Methods ---
  public createTitle(newTitle: Omit<Title, 'id' | 'createdAt' | 'totalViews'>): Title {
    const id = `vod-custom-${Date.now()}`;
    const title: Title = {
      ...newTitle,
      id,
      slug: newTitle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      totalViews: 0,
      createdAt: new Date().toISOString()
    };
    this.titles.unshift(title);
    return title;
  }

  public updateTitle(id: string, updates: Partial<Title>): Title | null {
    const idx = this.titles.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.titles[idx] = { ...this.titles[idx], ...updates };
    return this.titles[idx];
  }

  public deleteTitle(id: string): boolean {
    const idx = this.titles.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.titles.splice(idx, 1);
    return true;
  }

  public updateTitleAccessTier(id: string, accessTier: 'free' | 'vip_premium'): Title | null {
    const title = this.titles.find(t => t.id === id);
    if (!title) return null;
    title.accessTier = accessTier;
    return title;
  }
}

export const catalogService = new CatalogService();
