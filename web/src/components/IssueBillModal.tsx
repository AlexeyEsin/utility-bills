import React, { FC } from 'react';
import { Form, InputNumber, Modal, Select } from 'antd';

import { unitOptions } from 'utils';
import type { TUnit } from 'types/types';

type TIssueBillModalProps = {
  isOpen: boolean;
  onOk: (billAmount: number, unit: TUnit) => void;
  onCancel: VoidFunction;
};

const suffixSelector = (
  <Form.Item name="unit" noStyle>
    <Select style={{ width: 100 }} options={unitOptions} />
  </Form.Item>
);

export const IssueBillModal: FC<TIssueBillModalProps> = ({ isOpen, onOk, onCancel }) => {
  const [form] = Form.useForm<{ amount: number; unit: TUnit }>();
  const amount = Form.useWatch('amount', form);
  const unit = Form.useWatch('unit', form);

  const handleOk = () => {
    if (amount) {
      onOk(amount, unit);
    }
  };

  return (
    <Modal title="Выставить счёт" open={isOpen} onOk={handleOk} onCancel={onCancel} forceRender cancelText="Отмена">
      <Form form={form} name="issueBillForm" onFinish={handleOk} initialValues={{ unit: 'Wei' }}>
        <Form.Item name="amount" className="formItem" rules={[{ required: true, message: 'Введите сумму' }]}>
          <InputNumber className="amountInput" addonAfter={suffixSelector} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
