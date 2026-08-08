import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureFlagService, FeatureFlags } from '../../../core/services/feature-flag.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  flags$!: Observable<FeatureFlags>;

  readonly appVersion = '1.0.0';
  readonly appName = 'Accenture Todo App';
  readonly firebaseProject = 'accenture-todo-app-dfc2d';

  constructor(private featureFlagService: FeatureFlagService) {}

  ngOnInit(): void {
    this.flags$ = this.featureFlagService.flags$;
  }
}
