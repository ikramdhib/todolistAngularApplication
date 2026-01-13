import { createAction, props } from '@ngrx/store';
import { Task } from './task.state';

export const loadTasks = createAction(
  '[Tasks] Load Tasks',
  props<{ userEmail: string }>()
);

export const addTask = createAction(
  '[Tasks] Add Task',
  props<{ task: Omit<Task, 'id'> }>()
);

export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ id: number; changes: Partial<Task> }>()
);

export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ id: number }>()
);

export const toggleTaskComplete = createAction(
  '[Tasks] Toggle Complete',
  props<{ id: number }>()
);

export const clearTasks = createAction('[Tasks] Clear Tasks');