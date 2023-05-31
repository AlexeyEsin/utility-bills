import React, { FC, useState } from 'react';
import { Button, Form, Input, Spin, Typography, message } from 'antd';

import { InitialUserData, contract, web3 } from 'utils';
import type { TUserData } from 'types/types';

type TRegisterProps = {
  userAddress: string;
  toLogInPage: VoidFunction;
};

export const Register: FC<TRegisterProps> = ({ userAddress, toLogInPage }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<TUserData>();

  const handleFinish = () => {
    const formValues = form.getFieldsValue();
    const { address, username, password, firstName, middleName, lastName } = formValues;

    setIsLoading(true);
    contract.methods
      .Register(address, username, password, firstName, middleName, lastName)
      .send({ from: userAddress })
      .then(() => {
        messageApi.open({ type: 'success', content: 'Вы успешно зарегистрировались' });
        setIsLoading(false);
      })
      .catch(() => {
        messageApi.open({ type: 'error', content: 'Произошла ошибка' });
        setIsLoading(false);
      });
  };

  return (
    <div className="authContainer">
      {contextHolder}
      <Spin spinning={isLoading}>
        <div className="authForm">
          <Typography.Title level={3} className="header">
            Регистрация
          </Typography.Title>
          <Form
            form={form}
            name="register"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={InitialUserData}
            onFinish={handleFinish}
            autoComplete="off"
          >
            <Form.Item label="Фамилия" name="lastName" rules={[{ required: true, message: 'Введите фамилию!' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Имя" name="firstName" rules={[{ required: true, message: 'Введите имя!' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Отчество" name="middleName">
              <Input />
            </Form.Item>

            <Form.Item
              label="Адрес в блокчейн"
              name="address"
              rules={[
                { required: true, message: 'Введите адрес!' },
                {
                  validator: (_, value) =>
                    !value || web3.utils.isAddress(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error('Адрес некорректен')),
                },
              ]}
            >
              <Input />
            </Form.Item>

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
                  Зарегистрироваться
                </Button>
                <Button type="link" onClick={toLogInPage}>
                  Войти
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </div>
  );
};
