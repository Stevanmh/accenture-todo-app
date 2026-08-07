import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Category } from '../../../core/models/category.model';
import { CategoryService, CATEGORY_COLORS } from '../../../core/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesPage implements OnInit {
  categories$!: Observable<Category[]>;
  colors = CATEGORY_COLORS;

  showAddForm = false;
  newCategoryName = '';
  newCategoryColor = CATEGORY_COLORS[0];

  constructor(
    private categoryService: CategoryService,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.categories$;
  }

  async addCategory(): Promise<void> {
    const name = this.newCategoryName.trim();
    if (!name) { return; }
    await this.categoryService.createCategory(name, this.newCategoryColor);
    this.resetForm();
  }

  async confirmDelete(category: Category): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar categoría',
      message: `¿Eliminás "${category.name}"? Las tareas con esta categoría quedarán sin categoría.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.categoryService.deleteCategory(category.id)
        }
      ]
    });
    await alert.present();
  }

  selectColor(color: string): void {
    this.newCategoryColor = color;
  }

  trackById(_index: number, item: Category): string {
    return item.id;
  }

  private resetForm(): void {
    this.newCategoryName = '';
    this.newCategoryColor = CATEGORY_COLORS[0];
    this.showAddForm = false;
  }
}
