export interface StorageService {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, item: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}
