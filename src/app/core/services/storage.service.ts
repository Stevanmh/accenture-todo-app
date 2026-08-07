import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private initialized = false;

  constructor(private storage: Storage) {}

  /**
   * Initializes the storage engine.
   * Must be called once at app startup (from AppComponent.ngOnInit).
   */
  async init(): Promise<void> {
    await this.storage.create();
    this.initialized = true;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.initialized) { return null; }
    return this.storage.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    if (!this.initialized) {
      console.warn('[StorageService] set() called before init(). Data not saved.');
      return;
    }
    await this.storage.set(key, value);
  }

  async remove(key: string): Promise<void> {
    if (!this.initialized) { return; }
    await this.storage.remove(key);
  }

  async clear(): Promise<void> {
    if (!this.initialized) { return; }
    await this.storage.clear();
  }
}
