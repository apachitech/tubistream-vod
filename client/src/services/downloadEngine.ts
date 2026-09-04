import { Title } from '../types';

export interface DownloadItem {
  titleId: string;
  title: Title;
  sizeMb: number;
  downloadedAt: string;
  quality: string;
}

const STORAGE_KEY = 'tubistream_offline_downloads';

export const downloadEngine = {
  getDownloads(): DownloadItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isDownloaded(titleId: string): boolean {
    const list = this.getDownloads();
    return list.some(item => item.titleId === titleId);
  },

  saveDownload(title: Title, quality = '1080p'): DownloadItem {
    const list = this.getDownloads();
    const existing = list.find(item => item.titleId === title.id);
    if (existing) return existing;

    const newItem: DownloadItem = {
      titleId: title.id,
      title,
      sizeMb: Math.round((title.durationMinutes * 45) / 10), // ~450MB per 100min
      downloadedAt: new Date().toISOString(),
      quality
    };

    list.unshift(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newItem;
  },

  deleteDownload(titleId: string): void {
    const list = this.getDownloads().filter(item => item.titleId !== titleId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  getTotalStorageMb(): number {
    const list = this.getDownloads();
    return list.reduce((sum, item) => sum + item.sizeMb, 0);
  }
};
