import { Button, Card, Radio } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';

interface TodoFiltersProps {
  showFilters: boolean;
  filterStatus: 'all' | 'active' | 'completed';
  filterPriority: 'all' | 'low' | 'medium' | 'high';
  onToggleFilters: () => void;
  onStatusChange: (value: 'all' | 'active' | 'completed') => void;
  onPriorityChange: (value: 'all' | 'low' | 'medium' | 'high') => void;
  onClear: () => void;
}

export const TodoFilters = ({
  showFilters,
  filterStatus,
  filterPriority,
  onToggleFilters,
  onStatusChange,
  onPriorityChange,
  onClear,
}: TodoFiltersProps) => {
  const isActive = filterStatus !== 'all' || filterPriority !== 'all';

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            icon={<FilterOutlined />}
            onClick={onToggleFilters}
            type={showFilters ? 'primary' : 'default'}
          >
            Фильтры
          </Button>
          {isActive && (
            <Button icon={<ClearOutlined />} onClick={onClear}>
              Сбросить
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card size="small" className="bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">По статусу:</div>
              <Radio.Group
                value={filterStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="flex flex-col gap-1"
              >
                <Radio value="all">Все задачи</Radio>
                <Radio value="active">Только активные</Radio>
                <Radio value="completed">Только выполненные</Radio>
              </Radio.Group>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">По приоритету:</div>
              <Radio.Group
                value={filterPriority}
                onChange={(e) => onPriorityChange(e.target.value)}
                className="flex flex-col gap-1"
              >
                <Radio value="all">Все приоритеты</Radio>
                <Radio value="high">🔴 Только высокий</Radio>
                <Radio value="medium">🟡 Только средний</Radio>
                <Radio value="low">🟢 Только низкий</Radio>
              </Radio.Group>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
