import { Select, Input, Button, Tag, Checkbox, Popconfirm } from 'antd';
import type { TodoItem as TodoItemType } from '../../types/todo';
import { useState } from 'react';
import { CheckOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string, priority: 'low' | 'medium' | 'high') => void;
}

export const TodoItem = ({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText, editPriority);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
    setEditPriority(todo.priority);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const priorityColors = {
    low: 'green',
    medium: 'yellow',
    high: 'red',
  };

  const priorityLabels = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
  };

  return (
    <div className="flex items-center justify-between w-full group">
      {isEditing ? (
        <div className="flex gap-2 w-full">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
            className="flex-1"
          />
          <Select value={editPriority} onChange={setEditPriority} style={{ width: 100 }}>
            <Option value={'low'}>🟢 Низкий</Option>
            <Option value={'medium'}>🟡 Средний</Option>
            <Option value={'high'}>🔴 Высокий</Option>
          </Select>
          <Button type="text" icon={<CheckOutlined />} onClick={handleSave} />
          <Button type="text" icon={<CloseOutlined />} onClick={handleCancel} />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 flex-1 m-2">
            <Tag color={priorityColors[todo.priority]} className="w-20 text-center">
              {priorityLabels[todo.priority]}
            </Tag>
            <Checkbox checked={todo.completed} onChange={() => onToggle(todo.id)}>
              <span
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#999' : '#333',
                }}
              >
                {todo.text}
              </span>
            </Checkbox>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button type="text" icon={<EditOutlined />} onClick={() => setIsEditing(true)} />
            <Popconfirm
              title="Удалить задачу?"
              onConfirm={() => onDelete(todo.id)}
              okText="Да"
              cancelText="Нет"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        </>
      )}
    </div>
  );
};
