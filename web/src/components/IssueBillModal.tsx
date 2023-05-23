import React, { FC } from 'react';
import { Form, InputNumber, Modal, Select } from 'antd';

import { currencyOptions } from 'utils';
import type { TCurrency } from 'types/types';

type TIssueBillModalProps = {
  isOpen: boolean;
  onOk: (billAmount: number, currency: TCurrency) => void;
  onCancel: VoidFunction;
};

const suffixSelector = (
  <Form.Item name="currency" noStyle>
    <Select style={{ width: 100 }} options={currencyOptions} />
  </Form.Item>
);

export const IssueBillModal: FC<TIssueBillModalProps> = ({ isOpen, onOk, onCancel }) => {
  const [form] = Form.useForm<{ amount: number; currency: TCurrency }>();
  const amount = Form.useWatch('amount', form);
  const currency = Form.useWatch('currency', form);

  const handleOk = () => {
    if (amount) {
      onOk(amount, currency);
    }
  };

  return (
    <Modal title="Выставить счёт" open={isOpen} onOk={handleOk} onCancel={onCancel} forceRender>
      <Form form={form} name="issueBillForm" onFinish={handleOk} initialValues={{ currency: 'Wei' }}>
        <Form.Item name="amount" className="formItem" rules={[{ required: true, message: 'Введите сумму' }]}>
          <InputNumber className="amountInput" addonAfter={suffixSelector} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
