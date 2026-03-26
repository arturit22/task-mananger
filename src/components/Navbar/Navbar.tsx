import { LogoutOutlined, MoonFilled, MoonOutlined, UserOutlined } from '@ant-design/icons';
import { useThemeStore } from '../../store/themeStore';
import { Switch, message, Dropdown, Avatar, Button } from 'antd';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import { Login } from '../Auth/Login';
import { Register } from '../Auth/Register';

export default function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleLogout = () => {
    logout();
    message.success('Вы вышли из аккаунта');
  };

  const menuItems = [
    {
      key: 'logout',
      label: 'Выйти',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <nav className="flex justify-between items-center p-4 shadow-md bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
        <h1 className="text-xl font-bold">Task Manager</h1>
        <div className="flex items-center gap-4">
          <Switch
            checked={theme === 'dark'}
            onChange={toggleTheme}
            checkedChildren={<MoonFilled />}
            unCheckedChildren={<MoonOutlined />}
          />

          {user ? (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar icon={<UserOutlined />} />
                <span>{user.name}</span>
              </div>
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => setLoginOpen(true)}>
              Войти
            </Button>
          )}
        </div>
      </nav>

      <Login
        open={loginOpen}
        onClose={() => {
          setLoginOpen(false);
        }}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <Register
        open={registerOpen}
        onClose={() => {
          setRegisterOpen(false);
        }}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
}
