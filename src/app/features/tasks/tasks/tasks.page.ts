import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../../core/models/task.model';
import { Category } from '../../../core/models/category.model';
import { TaskService } from '../../../core/services/task.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksPage implements OnInit {
  tasks$!: Observable<Task[]>;
  categories$!: Observable<Category[]>;

  selectedCategoryId: string | null = null;
  showAddForm = false;
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskCategoryId: string | null = null;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.tasks$ = this.taskService.tasks$;
    this.categories$ = this.categoryService.categories$;
  }

  filterByCategory(categoryId: string | null): void {
    this.selectedCategoryId = categoryId;
  }

  getCategoryById(id: string | null, categories: Category[]): Category | undefined {
    if (!id) { return undefined; }
    return categories.find(c => c.id === id);
  }

  getFilteredTasks(tasks: Task[]): Task[] {
    if (!this.selectedCategoryId) { return tasks; }
    return tasks.filter(t => t.categoryId === this.selectedCategoryId);
  }

  async addTask(): Promise<void> {
    const title = this.newTaskTitle.trim();
    if (!title) { return; }
    await this.taskService.createTask(title, this.newTaskDescription || undefined, this.newTaskCategoryId || undefined);
    this.resetForm();
  }

  async toggleTask(id: string): Promise<void> {
    await this.taskService.toggleComplete(id);
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskService.deleteTask(id);
  }

  trackById(_index: number, item: Task): string {
    return item.id;
  }

  private resetForm(): void {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskCategoryId = null;
    this.showAddForm = false;
  }
}
