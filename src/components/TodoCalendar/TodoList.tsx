import { List } from 'antd';
import { TodoItem } from './TodoItem';
import type { TodoItem as TodoItemType } from '../../types/todo';

interface TodoListProps {
  todos: TodoItemType[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string, priority: 'low' | 'medium' | 'high') => void;
  emptyText?: string;
}

export const TodoList = ({ todos, onToggle, onDelete, onUpdate, emptyText }: TodoListProps) => {
  if (todos.length === 0) {
    return <div className="text-gray-400 text-center py-8">{emptyText || 'Нету задач'}</div>;
  }

  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <List
      key={sortedTodos.length}
      dataSource={sortedTodos}
      renderItem={(todo) => (
        <List.Item key={todo.id} className="hover:bg-gray-50 transition-colors">
          <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
        </List.Item>
      )}
    />
  );
};
