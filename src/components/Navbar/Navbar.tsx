import { MoonFilled, MoonOutlined } from '@ant-design/icons';
import { useThemeStore } from '../../store/themeStore';
import { Switch } from 'antd';

export default function Navbar() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="flex justify-between items-center p-4 shadow-md bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
      <h1 className="text-xl font-bold">Task Manager</h1>
      <div className="flex items-center gap-4">
        <Switch
          checked={theme === 'dark'}
          onChange={toggleTheme}
          checkedChildren={<MoonFilled />}
          unCheckedChildren={<MoonOutlined />}
        />
      </div>
    </div>
  );
}
