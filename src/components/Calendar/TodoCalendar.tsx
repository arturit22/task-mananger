import { useState } from 'react';
import { Calendar, Modal, Button, Input, message, Checkbox, List, Badge } from 'antd';
import type { Dayjs } from 'dayjs';
import type { TodoItem } from '../../types/todo';
import { useTodoStore } from '../../store/todoStore';

export default function TodoCalendar() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoStore();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');

  const getTodosForSelectedDate = (date: Date): TodoItem[] => {
    const dateStr = date.toISOString().split('T')[0];
    return todos.filter((todo) => {
      const todoDateStr = new Date(todo.date).toISOString().split('T')[0];
      return todoDateStr === dateStr;
    });
  };

  const getTodosCountForDate = (date: Dayjs): TodoItem[] => {
    const selectedDateStr = date.format('YYYY-MM-DD');

    return todos.filter((todo) => {
      const todoDateStr = new Date(todo.date).toISOString().split('T')[0];
      return todoDateStr === selectedDateStr;
    });
  };

  const handleDateClick = (date: Dayjs) => {
    setSelectedDate(date.toDate());
    setIsModalOpen(true);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ru', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const dateCellRender = (date: Dayjs) => {
    const todosForDate = getTodosCountForDate(date);
    if (todosForDate.length === 0) return null;

    const completedCount = todosForDate.filter((t) => t.completed).length;
    const activeCount = todosForDate.filter((t) => !t.completed).length;

    return (
      <div>
        {activeCount > 0 && <Badge count={activeCount} style={{ backgroundColor: '#dd4f4f' }} />}
        {completedCount > 0 && (
          <Badge count={completedCount} style={{ backgroundColor: '#52c41a' }} />
        )}
      </div>
    );
  };

  const handleAddTodo = () => {
    if (!newTodoText.trim()) {
      message.warning('Введите текст задачи');
      return;
    }

    addTodo(newTodoText, selectedDate);
    setNewTodoText('');
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
  };

  const todoForSelectedDate = getTodosForSelectedDate(selectedDate);

  return (
    <div className="flex my-20">
      <Calendar onSelect={handleDateClick} cellRender={dateCellRender} />
      <Modal
        title={`Задачи на ${formatDate(selectedDate)}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={500}
        footer={null}
      >
        <div className="flex flex-col gap-4">
          {todoForSelectedDate.length > 0 ? (
            <List
              key={todoForSelectedDate.length}
              dataSource={todoForSelectedDate}
              renderItem={(todo) => (
                <List.Item
                  key={todo.id}
                  className="hover:bg-gray-50 transition-colors group"
                  actions={[
                    <Button
                      key={todo.id}
                      type="text"
                      danger
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      Удалить
                    </Button>,
                  ]}
                >
                  <Checkbox checked={todo.completed} onChange={() => toggleTodo(todo.id)}>
                    <span
                      style={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#999' : '#333',
                      }}
                    >
                      {todo.text}
                    </span>
                  </Checkbox>
                </List.Item>
              )}
            />
          ) : (
            <div>Нету задач на этот день</div>
          )}
          <Input
            placeholder="Введите задачу"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onPressEnter={handleAddTodo}
          />
          <Button type="primary" onClick={handleAddTodo}>
            Добавить
          </Button>
        </div>
      </Modal>
    </div>
  );
}
