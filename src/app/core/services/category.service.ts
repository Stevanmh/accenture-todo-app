import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'categories';

// Predefined color palette for category selection in the UI
export const CATEGORY_COLORS: string[] = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
];

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private _categories = new BehaviorSubject<Category[]>([]);
  categories$: Observable<Category[]> = this._categories.asObservable();

  constructor(private storageService: StorageService) {}

  async load(): Promise<void> {
    const categories = await this.storageService.get<Category[]>(STORAGE_KEY);
    this._categories.next(categories ?? []);
  }

  private async persist(categories: Category[]): Promise<void> {
    await this.storageService.set(STORAGE_KEY, categories);
    this._categories.next(categories);
  }

  async createCategory(name: string, color: string): Promise<void> {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: Date.now()
    };
    const updated = [...this._categories.getValue(), newCategory];
    await this.persist(updated);
  }

  async updateCategory(id: string, changes: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<void> {
    const updated = this._categories.getValue().map(cat =>
      cat.id === id ? { ...cat, ...changes } : cat
    );
    await this.persist(updated);
  }

  async deleteCategory(id: string): Promise<void> {
    const updated = this._categories.getValue().filter(cat => cat.id !== id);
    await this.persist(updated);
  }

  getCategoryById(id: string): Category | undefined {
    return this._categories.getValue().find(cat => cat.id === id);
  }
}
