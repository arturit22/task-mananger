import { create } from 'zustand';
import type { TodoItem } from '../types/todo';
import { persist } from 'zustand/middleware';
import { message } from 'antd';

interface TodoStore {
  todos: TodoItem[];
  addTodo: (text: string, date: Date, priority?: 'high' | 'medium' | 'low') => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, newText: string, priority?: 'high' | 'medium' | 'low') => void;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (text: string, date: Date, priority: 'high' | 'medium' | 'low' = 'low') => {
        const newTodo: TodoItem = {
          id: Date.now().toString(),
          text,
          completed: false,
          date: date.toISOString(),
          priority,
        };

        set((state) => ({
          todos: [...state.todos, newTodo],
        }));

        const priorityText = {
          low: '🟢 Низкий',
          medium: '🟡 Средний',
          high: '🔴 Высокий ',
        };
        message.success(`Задача добавлена (${priorityText[priority]})`);
      },

      toggleTodo: (id: string) => {
        set((state) => {
          const todo = state.todos.find((t) => t.id === id);
          const newStatus = !todo?.completed;

          if (newStatus) {
            message.success('Задача выполнена');
          } else {
            message.info('Задача возвращена');
          }

          return {
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
          };
        });
      },

      deleteTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
        message.warning('Задача удалена');
      },

      updateTodo: (id: string, newText: string, newPriority?: 'low' | 'medium' | 'high') => {
        if (!newText.trim()) {
          message.warning('Введите задачу');
          return;
        }

        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, text: newText, ...(newPriority && { priority: newPriority }) }
              : todo
          ),
        }));

        message.success('Задача отредактирована');
      },
    }),
    {
      name: 'todo-storage',
    }
  )
);
