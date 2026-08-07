import { Component, OnInit } from '@angular/core';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private storageService: StorageService) {}

  async ngOnInit(): Promise<void> {
    await this.storageService.init();
  }
}
