import { Component, OnInit } from '@angular/core';
import { StorageService } from './core/services/storage.service';
import { TaskService } from './core/services/task.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private taskService: TaskService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.storageService.init();
    await this.taskService.load();
  }
}
