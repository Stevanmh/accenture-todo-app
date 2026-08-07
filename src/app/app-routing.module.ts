import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/tasks/tasks.module').then( m => m.TasksPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./features/categories/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings/settings.module').then( m => m.SettingsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
