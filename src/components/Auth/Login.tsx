import { Form, message, Modal, Input, Button } from 'antd';
import { useAuthStore } from '../../store/authStore';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

interface LoginProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const Login = ({ open, onClose, onSwitchToRegister }: LoginProps) => {
  const [form] = Form.useForm();
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
      message.success('Добро пожаловать!');
      onClose();
      form.resetFields();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ошибка входа');
    }
  };

  return (
    <Modal title="Вход в аккаунт" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="email"
          label="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Введите корректный email' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="user@example.com" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
            Войти
          </Button>
        </Form.Item>

        <div>
          <Button type="link" onClick={onSwitchToRegister}>
            Зарегистрироваться
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
