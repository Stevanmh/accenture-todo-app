import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getValue, RemoteConfig } from 'firebase/remote-config';
import { environment } from '../../../environments/environment';

/**
 * Typed map of all feature flags used in the application.
 * Adding a new flag = 1) add here, 2) add to DEFAULT_FLAGS, 3) read in load().
 */
export interface FeatureFlags {
  showCompletedTasks: boolean;
  enableCategories: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  showCompletedTasks: true,
  enableCategories: true,
};

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private _flags = new BehaviorSubject<FeatureFlags>(DEFAULT_FLAGS);

  /** Observable stream of all feature flags. Components subscribe to react to changes. */
  flags$: Observable<FeatureFlags> = this._flags.asObservable();

  /**
   * Initializes Firebase and fetches Remote Config values.
   * Falls back to DEFAULT_FLAGS if Firebase is unreachable.
   * Must be called from AppComponent.ngOnInit after storage is initialized.
   */
  async load(): Promise<void> {
    try {
      // Prevent duplicate Firebase app initialization on hot reload
      const firebaseApp: FirebaseApp = getApps().length === 0
        ? initializeApp(environment.firebaseConfig)
        : getApps()[0];

      const remoteConfig: RemoteConfig = getRemoteConfig(firebaseApp);

      // Dev: fetch on every load. Prod: cache for 12 hours.
      remoteConfig.settings.minimumFetchIntervalMillis =
        environment.production ? 43_200_000 : 0;

      // Defaults ensure the app works even if Firebase is unreachable
      remoteConfig.defaultConfig = {
        show_completed_tasks: true,
        enable_categories: true,
      };

      await fetchAndActivate(remoteConfig);

      this._flags.next({
        showCompletedTasks: getValue(remoteConfig, 'show_completed_tasks').asBoolean(),
        enableCategories: getValue(remoteConfig, 'enable_categories').asBoolean(),
      });

    } catch (error) {
      // Graceful degradation: defaults remain active, app keeps working
      console.warn('[FeatureFlagService] Remote Config fetch failed. Using defaults.', error);
    }
  }

  /** Synchronous accessor for a single flag value (for non-reactive contexts). */
  getFlag<K extends keyof FeatureFlags>(key: K): FeatureFlags[K] {
    return this._flags.getValue()[key];
  }
}
