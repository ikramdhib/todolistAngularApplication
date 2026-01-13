import { createReducer, on } from '@ngrx/store';
import * as TaskActions from './task.actions';
import { initialTaskState, Task } from './task.state';

export const taskReducer = createReducer(
  initialTaskState,
  //load tasks from localstorge
  on(TaskActions.loadTasks, (state, { userEmail }) => {
    const storedTasks = localStorage.getItem(`tasks_${userEmail}`);
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    return { ...state, tasks };
  }),
  //add
  on(TaskActions.addTask, (state, { task }) => {
    const newTask: Task = {
      ...task,
      id: Date.now() 
    };
    const updatedTasks = [newTask, ...state.tasks];
    
    localStorage.setItem(
      `tasks_${task.userEmail}`,
      JSON.stringify(updatedTasks)
    );
    
    return { ...state, tasks: updatedTasks };
  }),
  //update
  on(TaskActions.updateTask, (state, { id, changes }) => {
    const updatedTasks = state.tasks.map(task =>
      task.id === id ? { ...task, ...changes } : task
    );
    
    if (updatedTasks.length > 0) {
      localStorage.setItem(
        `tasks_${updatedTasks[0].userEmail}`,
        JSON.stringify(updatedTasks)
      );
    }
    
    return { ...state, tasks: updatedTasks };
  }),
  //deleted
  on(TaskActions.deleteTask, (state, { id }) => {
    const updatedTasks = state.tasks.filter(task => task.id !== id);
    
    if (state.tasks.length > 0) {
      const userEmail = state.tasks[0].userEmail;
      localStorage.setItem(
        `tasks_${userEmail}`,
        JSON.stringify(updatedTasks)
      );
    }
    
    return { ...state, tasks: updatedTasks };
  }),
  //completed
  on(TaskActions.toggleTaskComplete, (state, { id }) => {
    const updatedTasks = state.tasks.map(task =>
      task.id === id ? { ...task, is_completed: !task.is_completed } : task
    );
    
    if (updatedTasks.length > 0) {
      localStorage.setItem(
        `tasks_${updatedTasks[0].userEmail}`,
        JSON.stringify(updatedTasks)
      );
    }
    
    return { ...state, tasks: updatedTasks };
  }),
  
  on(TaskActions.clearTasks, () => initialTaskState) //retourner a letat init
);