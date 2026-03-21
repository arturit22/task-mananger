import React, { useState } from 'react';
import {
  Calendar,
  Modal,
  Button,
  Input,
  message,
  Checkbox,
  List,
  Badge,
  Space,
  Popconfirm,
  Select,
  Tag,
} from 'antd';
import type { Dayjs } from 'dayjs';
import type { TodoItem } from '../../types/todo';
import { useTodoStore } from '../../store/todoStore';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;

const priorityColors = {
  low: { bg: '#52c41a', text: 'white', label: '🟢 Низкий' },
  medium: { bg: '#faad14', text: 'white', label: '🟡 Средний' },
  high: { bg: '#ff4d4f', text: 'white', label: '🔴 Высокий' },
};

export default function TodoCalendar() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodoStore();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [NewTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('low');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingPriority, setEditingPriority] = useState<'low' | 'medium' | 'high'>('low');

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
    setEditingId(null);
    setEditingText('');
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

    addTodo(newTodoText, selectedDate, NewTodoPriority);
    setNewTodoText('');
    setNewTodoPriority('low');
  };

  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
    setEditingPriority(todo.priority);
  };

  const saveEditing = () => {
    if (editingId && editingText.trim()) {
      updateTodo(editingId, editingText, editingPriority);
      setEditingId(null);
      setEditingText('');
    } else {
      message.warning('Введите текст задачи');
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const todoForSelectedDate = getTodosForSelectedDate(selectedDate);

  const sortedTodos = [...todoForSelectedDate].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="flex my-20">
      <Calendar onSelect={handleDateClick} cellRender={dateCellRender} />
      <Modal
        title={`Задачи на ${formatDate(selectedDate)}`}
        open={isModalOpen}
        onCancel={() => {
          (setIsModalOpen(false), setEditingId(null));
        }}
        width={500}
        footer={null}
      >
        <div className="flex flex-col gap-4">
          {sortedTodos.length > 0 ? (
            <List
              key={todoForSelectedDate.length}
              dataSource={sortedTodos}
              renderItem={(todo) => (
                <List.Item
                  key={todo.id}
                  className="hover:bg-gray-50 transition-colors group"
                  actions={[
                    editingId === todo.id ? (
                      <Space>
                        <Button type="text" icon={<CheckOutlined />} onClick={saveEditing} />
                        <Button type="text" icon={<CloseOutlined />} onClick={cancelEditing} />
                      </Space>
                    ) : (
                      <Space>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => startEditing(todo)}
                        />
                        <Popconfirm
                          title="Удалить задачу?"
                          onConfirm={() => deleteTodo(todo.id)}
                          okText="Да"
                          cancelText="Нет"
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Space>
                    ),
                  ]}
                >
                  <Tag
                    color={
                      todo.priority === 'low'
                        ? 'green'
                        : todo.priority === 'medium'
                          ? 'yellow'
                          : 'red'
                    }
                  >
                    {todo.priority === 'low'
                      ? 'Низкий'
                      : todo.priority === 'medium'
                        ? 'Средний'
                        : 'Высокий'}
                  </Tag>

                  {editingId === todo.id ? (
                    <div>
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={handleEditKeyPress}
                        autoFocus
                        size="small"
                      />
                      <Select
                        value={editingPriority}
                        onChange={(value) => setEditingPriority(value)}
                      >
                        <Option value="low">🟢 Низкий</Option>
                        <Option value="medium">🟡 Средний</Option>
                        <Option value="high">🔴 Высокий</Option>
                      </Select>
                    </div>
                  ) : (
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
                  )}
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
          <Select value={NewTodoPriority} onChange={setNewTodoPriority}>
            <Option value="low">🟢 Низкий</Option>
            <Option value="medium">🟡 Средний</Option>
            <Option value="high">🔴 Высокий</Option>
          </Select>
          <Button type="primary" onClick={handleAddTodo}>
            Добавить
          </Button>
        </div>
      </Modal>
    </div>
  );
}
