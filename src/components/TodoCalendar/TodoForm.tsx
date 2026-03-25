import { useState } from 'react';
import { Input, Select, Button } from 'antd';

interface TodoFormProps {
  onAdd: (text: string, priority: 'low' | 'medium' | 'high') => void;
}

const { Option } = Select;

export const TodoForm = ({ onAdd }: TodoFormProps) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text, priority);
      setText('');
      setPriority('low');
    }
  };

  return (
    <div className="flex gap-2 pt-4 border-t">
      <Input
        placeholder="Новая задача..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPressEnter={handleSubmit}
        className="flex-1"
      />
      <Select value={priority} onChange={setPriority} style={{ width: 120 }}>
        <Option value="low">🟢 Низкий</Option>
        <Option value="medium">🟡 Средний</Option>
        <Option value="high">🔴 Высокий</Option>
      </Select>
      <Button type="primary" onClick={handleSubmit}>
        Добавить
      </Button>
    </div>
  );
};
