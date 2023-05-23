import React, { FC } from 'react';
import { Button, Form, Input, Typography } from 'antd';

import { TPayer } from 'types/types';

type TAddPayerFormProps = {
  onAdd: (data: TPayer) => void;
};

const initialFormValues: Partial<TPayer> = {
  address: '',
  name: '',
};

export const AddPayerForm: FC<TAddPayerFormProps> = ({ onAdd }) => {
  const [form] = Form.useForm<TPayer>();

  return (
    <div className="addPayerForm">
      <Typography.Title level={4}>Добавить плательщика</Typography.Title>
      <Form
        form={form}
        name="addPayerForm"
        autoComplete="off"
        onFinish={onAdd}
        layout="inline"
        initialValues={initialFormValues}
      >
        <Form.Item name="address" className="formItem">
          <Input placeholder="Адрес в Блокчейн" />
        </Form.Item>
        <Form.Item name="name">
          <Input placeholder="Имя" className="formItem" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
