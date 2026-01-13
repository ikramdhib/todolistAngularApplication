import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.state';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state) => state.tasks
);//tous les taches

export const selectCompletedTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(t => t.is_completed)
);//les taches completer

export const selectPendingTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(t => !t.is_completed)
);//les taches en attente

export const selectTasksCount = createSelector(
  selectAllTasks,
  (tasks) => ({
    total: tasks.length,
    completed: tasks.filter(t => t.is_completed).length,
    pending: tasks.filter(t => !t.is_completed).length
  })//compter le nombre des taches
);