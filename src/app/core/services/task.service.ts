import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Private: only this service can emit new values
  private _tasks = new BehaviorSubject<Task[]>([]);

  // Public: components subscribe to this read-only stream
  tasks$: Observable<Task[]> = this._tasks.asObservable();

  constructor(private storageService: StorageService) {}

  /**
   * Loads tasks from local storage into the state.
   * Must be called after StorageService.init() (from AppComponent.ngOnInit).
   */
  async load(): Promise<void> {
    const tasks = await this.storageService.get<Task[]>(STORAGE_KEY);
    this._tasks.next(tasks ?? []);
  }

  private async persist(tasks: Task[]): Promise<void> {
    await this.storageService.set(STORAGE_KEY, tasks);
    this._tasks.next(tasks);
  }

  async createTask(title: string, description?: string, categoryId?: string | null): Promise<void> {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      categoryId: categoryId ?? null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    // New task goes to the top of the list
    const updated = [newTask, ...this._tasks.getValue()];
    await this.persist(updated);
  }

  async updateTask(id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<void> {
    const updated = this._tasks.getValue().map(task =>
      task.id === id
        ? { ...task, ...changes, updatedAt: Date.now() }
        : task
    );
    await this.persist(updated);
  }

  async toggleComplete(id: string): Promise<void> {
    const task = this._tasks.getValue().find(t => t.id === id);
    if (!task) { return; }
    await this.updateTask(id, { completed: !task.completed });
  }

  async deleteTask(id: string): Promise<void> {
    const updated = this._tasks.getValue().filter(task => task.id !== id);
    await this.persist(updated);
  }
}
