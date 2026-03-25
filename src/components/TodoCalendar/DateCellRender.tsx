import type { Dayjs } from 'dayjs';
import { Badge } from 'antd';
import type { TodoItem } from '../../types/todo';

interface DateCellRenderProps {
  date: Dayjs;
  todos: TodoItem[];
}

export const DateCellRender = ({ date, todos }: DateCellRenderProps) => {
  const dateStr = date.format('YYYY-MM-DD');

  const todosForDate = todos.filter((todo) => {
    const todoDateStr = new Date(todo.date).toISOString().split('T')[0];
    return todoDateStr === dateStr;
  });

  if (todosForDate.length === 0) return null;

  const completedCount = todosForDate.filter((t) => t.completed).length;
  const activeCount = todosForDate.filter((t) => !t.completed).length;

  return (
    <div className="flex gap-1 mt-1">
      {activeCount > 0 && <Badge count={activeCount} style={{ backgroundColor: '#dd4f4f' }} />}
      {completedCount > 0 && (
        <Badge count={completedCount} style={{ backgroundColor: '#52c41a' }} />
      )}
    </div>
  );
};
