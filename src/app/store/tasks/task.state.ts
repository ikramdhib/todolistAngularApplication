export interface Task {
  id: number;
  title: string;
  description: string;
  priority: number; 
  due_date: string;
  is_completed: boolean;
  userEmail: string; 
} //structure de tache

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}//structure de letat des taches

export const initialTaskState: TaskState = {
  tasks: [],
  loading: false,
  error: null
};// structure init de letat des taches