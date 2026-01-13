import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedModule } from '../shared/shared.module';

import * as AuthActions from '../store/auth/auth.actions';
import * as TaskActions from '../store/tasks/task.actions';
import { selectCurrentUserEmail } from '../store/auth/auth.selectors';
import {
  selectAllTasks,
  selectCompletedTasks,
  selectPendingTasks,
  selectTasksCount
} from '../store/tasks/task.selectors';
import { Task } from '../store/tasks/task.state';

@Component({
  selector: 'app-todolist',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.scss'
})
export class TodolistComponent implements OnInit, OnDestroy {

  currentUserEmail$: Observable<string | null>;
  allTasks$: Observable<Task[]>;
  completedTasks$: Observable<Task[]>;
  pendingTasks$: Observable<Task[]>;
  tasksCount$: Observable<{ total: number; completed: number; pending: number }>;

  private destroy$ = new Subject<void>();

  currentTask: Omit<Task, 'id' | 'userEmail'> = {
    title: '',
    description: '',
    priority: 3, 
    due_date: '',
    is_completed: false
  };

  isEditing = false;
  editingTaskId: number | null = null;
  
  filterStatus: 'all' | 'pending' | 'completed' = 'all';
  searchTerm = '';

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.currentUserEmail$ = this.store.select(selectCurrentUserEmail);
    this.allTasks$ = this.store.select(selectAllTasks);
    this.completedTasks$ = this.store.select(selectCompletedTasks);
    this.pendingTasks$ = this.store.select(selectPendingTasks);
    this.tasksCount$ = this.store.select(selectTasksCount);
  }

  ngOnInit(): void {
    // Charger les tâches de lutilisateur connecte
    this.currentUserEmail$
      .pipe(takeUntil(this.destroy$))
      .subscribe(email => {
        if (email) {
          this.store.dispatch(TaskActions.loadTasks({ userEmail: email }));
        } else {
          this.router.navigate(['/login']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  submitTask(): void {
    if (!this.currentTask.title.trim()) return;

    this.currentUserEmail$
      .pipe(takeUntil(this.destroy$))
      .subscribe(email => {
        if (!email) return;

        if (this.isEditing && this.editingTaskId !== null) {
          this.store.dispatch(TaskActions.updateTask({
            id: this.editingTaskId,
            changes: this.currentTask
          }));
          this.cancelEdit();
        } else {
          this.store.dispatch(TaskActions.addTask({
            task: { ...this.currentTask, userEmail: email }
          }));
          this.resetForm();
        }
      })
      .unsubscribe(); 
  }

  editTask(task: Task): void {
    this.currentTask = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      due_date: task.due_date,
      is_completed: task.is_completed
    };
    this.isEditing = true;
    this.editingTaskId = task.id;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteTask(taskId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.store.dispatch(TaskActions.deleteTask({ id: taskId }));
    }
  }

  toggleComplete(task: Task): void {
    this.store.dispatch(TaskActions.toggleTaskComplete({ id: task.id }));
  }

  cancelEdit(): void {
    this.resetForm();
    this.isEditing = false;
    this.editingTaskId = null;
  }

  resetForm(): void {
    this.currentTask = {
      title: '',
      description: '',
      priority: 3,
      due_date: '',
      is_completed: false
    };
  }

  
  getFilteredTasks(tasks: Task[]): Task[] {
    if (!tasks) return [];

    let filtered = [...tasks];

    if (this.filterStatus === 'completed') {
      filtered = filtered.filter(t => t.is_completed);
    } else if (this.filterStatus === 'pending') {
      filtered = filtered.filter(t => !t.is_completed);
    }

    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }


  logout(): void {
    if (confirm('Se déconnecter ? Vos tâches seront sauvegardées.')) {
      this.store.dispatch(AuthActions.logout());
      this.store.dispatch(TaskActions.clearTasks());
      this.router.navigate(['/login']);
    }
  }

  getPriorityLabel(priority: number): string {
    const labels: { [key: number]: string } = {
      1: 'Priorité 1 (Très basse)',
      2: 'Priorité 2 (Basse)',
      3: 'Priorité 3 (Moyenne)',
      4: 'Priorité 4 (Haute)',
      5: 'Priorité 5 (Très haute)'
    };
    return labels[priority] || `Priorité ${priority}`;
  }


  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString('fr-FR', options);
  }

 
  isOverdue(task: Task): boolean {
    if (!task.due_date || task.is_completed) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  }

  
  getEmptyStateMessage(): string {
    if (this.searchTerm.trim()) {
      return 'Aucune tâche ne correspond à votre recherche';
    }
    
    if (this.filterStatus === 'completed') {
      return 'Vous n\'avez pas encore complété de tâches';
    }
    
    if (this.filterStatus === 'pending') {
      return 'Toutes vos tâches sont complétées ! 🎉';
    }
    
    return 'Commencez par ajouter votre première tâche';
  }
}