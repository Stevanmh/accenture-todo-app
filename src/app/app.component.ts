import { Component, OnInit } from '@angular/core';
import { StorageService } from './core/services/storage.service';
import { TaskService } from './core/services/task.service';
import { CategoryService } from './core/services/category.service';
import { FeatureFlagService } from './core/services/feature-flag.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private featureFlagService: FeatureFlagService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.storageService.init();
    await this.categoryService.load();
    await this.taskService.load();
    // Feature flags load last — local data must work even if Firebase is unreachable
    this.featureFlagService.load();
  }
}

