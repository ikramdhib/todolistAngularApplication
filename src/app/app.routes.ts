import { Routes } from '@angular/router';

export const routes: Routes = [

       {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./todolist/todolist.component').then(m => m.TodolistComponent),
  
  },
  {
    path: '',
    redirectTo: '/login', 
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }


];
