import React, { FC, useState } from 'react';
import { Button, Form, Input, Spin, Typography, message } from 'antd';

import { InitialUserData, contract } from 'utils';
import type { TUserData } from 'types/types';

type TLogInProps = {
  address: string;
  onLogIn: VoidFunction;
  onLogInAsAdmin: VoidFunction;
  toRegisterPage: VoidFunction;
};

export const LogIn: FC<TLogInProps> = ({ address, onLogIn, onLogInAsAdmin, toRegisterPage }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<TUserData>();

  const handleLogInAsAdmin = () => {
    contract.methods
      .LogInAsAdmin()
      .call({ from: address })
      .then((result: boolean) => {
        if (result) {
          onLogInAsAdmin();
        }
        setIsLoading(false);
      })
      .catch(() => {
        messageApi.open({ type: 'error', content: 'Проверьте правильность данных и аккаунта в MetaMask!' });
        setIsLoading(false);
      });
  };

  const handleLogInAsPayer = (username: string, password: string) => {
    contract.methods
      .LogIn(username, password)
      .call({ from: address })
      .then(() => {
        onLogIn();
        setIsLoading(false);
      })
      .catch(() => {
        messageApi.open({ type: 'error', content: 'Проверьте правильность данных и аккаунта в MetaMask!' });
        setIsLoading(false);
      });
  };

  const handleFinish = () => {
    const formValues = form.getFieldsValue();
    const { username, password } = formValues;

    setIsLoading(true);

    if (username === 'admin') {
      if (password === 'admin') {
        handleLogInAsAdmin();
      } else {
        messageApi.open({ type: 'error', content: 'Неверный пароль!' });
      }
    } else {
      handleLogInAsPayer(username, password);
    }
  };

  return (
    <div className="authContainer">
      {contextHolder}
      <Spin spinning={isLoading}>
        <div className="authForm">
          <Typography.Title level={3} className="header">
            Авторизация
          </Typography.Title>
          <Form
            form={form}
            name="logIn"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={InitialUserData}
            onFinish={handleFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Логин"
              name="username"
              rules={[
                { required: true, message: 'Введите логин!' },
                { min: 4, message: 'Минимальная длина логина - 4 символа' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="password"
              rules={[
                { required: true, message: 'Введите пароль!' },
                { min: 4, message: 'Минимальная длина пароля - 4 символа' },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6 }}>
              <div className="buttons">
                <Button type="primary" htmlType="submit">
                  Войти
                </Button>
                <Button type="link" onClick={toRegisterPage}>
                  Регистрация
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </div>
  );
};
