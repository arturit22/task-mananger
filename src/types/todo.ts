export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  createdAt?: string;
  priority?: string;
}
