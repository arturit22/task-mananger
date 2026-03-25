interface TodoStatsProps {
  total: number;
  active: number;
  completed: number;
  low: number;
  medium: number;
  high: number;
}

export const TodoStats = ({ total, active, completed, low, medium, high }: TodoStatsProps) => {
  return (
    <div className="flex justify-between text-xs text-gray-400 border-b pb-2">
      <span>
        Всего: {total} | Активных: {active} | Выполнено: {completed}
      </span>
      <span>
        <span className="text-red-500 mr-2">Высоких: {high}</span>
        <span className="text-orange-500 mr-2">Средних: {medium}</span>
        <span className="text-green-500">Низких: {low}</span>
      </span>
    </div>
  );
};
