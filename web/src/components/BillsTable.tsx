import React, { FC } from 'react';
import { Button, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { getStatusTag, statusPriority } from 'utils';
import type { TBill } from 'types/types';

type TBillsTableProps = {
  tableData: TBill[];
  isAdmin: boolean;
  onMakePayment?: (billUuid: string, amount: string) => void;
};

export const BillsTable: FC<TBillsTableProps> = ({ tableData, isAdmin, onMakePayment }) => {
  const columns: ColumnsType<TBill> = [
    {
      title: 'Сумма',
      dataIndex: 'amountWithCurrency',
      key: 'amountWithCurrency',
      sorter: (a, b) => a.amount.localeCompare(b.amount),
    },
    {
      title: 'Дата выставления',
      dataIndex: 'billingDate',
      key: 'billingDate',
      sorter: (a, b) => new Date(a.billingDate).getTime() - new Date(b.billingDate).getTime(),
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      title: 'Дата оплаты',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      sorter: (a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
      render: (value) => (!value ? '-' : new Date(value).toLocaleDateString()),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => statusPriority[a.status] - statusPriority[b.status],
      render: (_, record) => getStatusTag(record.status),
    },
  ];

  if (!isAdmin && !!onMakePayment) {
    columns.push({
      title: 'Действие',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) =>
        record.status === 'unpaid' ? (
          <Button type="primary" onClick={() => onMakePayment(record.uuid, record.amount)}>
            Оплатить
          </Button>
        ) : null,
    });
  }

  return (
    <div className="billsTableContainer">
      <Typography.Title level={4}>Счета плательщика</Typography.Title>
      <Table
        className="billsTable"
        rowKey="uuid"
        columns={columns}
        dataSource={tableData}
        bordered
        size="small"
        pagination={{
          pageSize: 5,
        }}
      />
    </div>
  );
};

BillsTable.defaultProps = {
  onMakePayment: undefined,
};
