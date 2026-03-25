// components/TodoCalendar/TodoCalendar.tsx
import { useState } from 'react';
import { Calendar, Modal } from 'antd';
import type { Dayjs } from 'dayjs';
import { useTodoStore } from '../../store/todoStore';
import { formatDate, getDateKey } from '../../utils/dateUtils';
import { DateCellRender } from './DateCellRender';
import { TodoList } from './TodoList';
import { TodoForm } from './TodoForm';
import { TodoStats } from './TodoStats';
import { TodoFilters } from './TodoFilters';

export default function TodoCalendar() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodoStore();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const getTodosForDate = (date: Date) => {
    const dateKey = getDateKey(date);
    return todos.filter((todo) => {
      const todoDateKey = getDateKey(new Date(todo.date));
      return todoDateKey === dateKey;
    });
  };

  const handleDateClick = (date: Dayjs) => {
    setSelectedDate(date.toDate());
    setIsModalOpen(true);
    setFilterStatus('all');
    setFilterPriority('all');
  };

  const getFilteredTodos = () => {
    let filtered = getTodosForDate(selectedDate);

    if (filterStatus === 'active') {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter((todo) => todo.completed);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter((todo) => todo.priority === filterPriority);
    }

    return filtered;
  };

  const getStats = () => {
    const todosForDate = getTodosForDate(selectedDate);
    const total = todosForDate.length;
    const active = todosForDate.filter((t) => !t.completed).length;
    const completed = todosForDate.filter((t) => t.completed).length;
    const high = todosForDate.filter((t) => t.priority === 'high' && !t.completed).length;
    const medium = todosForDate.filter((t) => t.priority === 'medium' && !t.completed).length;
    const low = todosForDate.filter((t) => t.priority === 'low' && !t.completed).length;

    return { total, active, completed, high, medium, low };
  };

  const filteredTodos = getFilteredTodos();
  const stats = getStats();

  const handleAddTodo = (text: string, priority: 'low' | 'medium' | 'high') => {
    addTodo(text, selectedDate, priority);
  };

  const handleClearFilters = () => {
    setFilterStatus('all');
    setFilterPriority('all');
  };

  return (
    <div className="flex my-20">
      <Calendar
        onSelect={handleDateClick}
        cellRender={(date) => <DateCellRender date={date} todos={todos} />}
        className="dark:bg-gray-800 dark:text-white"
      />

      <Modal
        title={`Задачи на ${formatDate(selectedDate)}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={600}
        footer={null}
        destroyOnClose={true}
      >
        <div className="flex flex-col gap-4">
          <TodoFilters
            showFilters={showFilters}
            filterStatus={filterStatus}
            filterPriority={filterPriority}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onStatusChange={setFilterStatus}
            onPriorityChange={setFilterPriority}
            onClear={handleClearFilters}
          />

          <TodoStats {...stats} />

          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
            emptyText={
              filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Нет задач, соответствующих фильтрам'
                : 'Нет задач на этот день'
            }
          />

          <TodoForm onAdd={handleAddTodo} />
        </div>
      </Modal>
    </div>
  );
}
