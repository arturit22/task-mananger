import { Form, message, Modal, Input, Button } from 'antd';
import { useAuthStore } from '../../store/authStore';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

interface RegisterProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const Register = ({ open, onClose, onSwitchToLogin }: RegisterProps) => {
  const [form] = Form.useForm();
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    try {
      await register(values.email, values.password, values.name);
      message.success('Регистрация успешна! Теперь войдите в аккаунт');
      onClose();
      onSwitchToLogin();
      form.resetFields();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Ошибка регистрации');
    }
  };

  return (
    <Modal title="Регистрация" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите имя' }]}>
          <Input prefix={<UserOutlined />} placeholder="Ваше имя" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Введите корректный email' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="user@example.com" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Пароль"
          rules={[
            { required: true, message: 'Введите пароль' },
            { min: 6, message: 'Пароль должен быть не менее 6 символов' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" size="large" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Подтвердите пароль"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Подтвердите пароль' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Пароли не совпадают'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите пароль" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
            Зарегистрироваться
          </Button>
        </Form.Item>

        <div className="text-center">
          <Button type="link" onClick={onSwitchToLogin}>
            Уже есть аккаунт? Войти
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
