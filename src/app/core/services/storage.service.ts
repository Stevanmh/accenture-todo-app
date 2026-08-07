import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {}

  /**
   * Initializes the storage engine.
   * Must be called once at app startup (from AppComponent.ngOnInit).
   */
  async init(): Promise<void> {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async get<T>(key: string): Promise<T | null> {
    return this._storage?.get(key) ?? null;
  }

  async set(key: string, value: any): Promise<any> {
    return this._storage?.set(key, value);
  }

  async remove(key: string): Promise<any> {
    return this._storage?.remove(key);
  }

  async clear(): Promise<void> {
    await this._storage?.clear();
  }
}
