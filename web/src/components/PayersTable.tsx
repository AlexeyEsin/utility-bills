import React, { FC } from 'react';
import { Button, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { TPayer } from 'types/types';

type TPayersTableProps = {
  tableData: TPayer[];
  onIssueBill: (payerAddress: string) => void;
  onRowClick: (payerAddress: string) => void;
};

export const PayersTable: FC<TPayersTableProps> = ({ tableData, onIssueBill, onRowClick }) => {
  const columns: ColumnsType<TPayer> = [
    {
      title: 'Адрес в Блокчейн',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Имя плательщика',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Выставленных счетов',
      dataIndex: 'billsCount',
      key: 'billsCount',
      sorter: (a, b) => a.billsCount - b.billsCount,
    },
    {
      title: 'Неоплаченных счетов',
      dataIndex: 'unpaidBillsCount',
      key: 'unpaidBillsCount',
      sorter: (a, b) => a.unpaidBillsCount - b.unpaidBillsCount,
    },
    {
      title: 'Сумма неуплаты',
      dataIndex: 'unpaidAmountWithUnit',
      key: 'unpaidAmountWithUnit',
      sorter: (a, b) => a.unpaidAmount.localeCompare(b.unpaidAmount),
    },
    {
      title: 'Действие',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => onIssueBill(record.address)}>
          Выставить счёт
        </Button>
      ),
    },
  ];

  return (
    <div className="payersTableContainer">
      <Typography.Title level={4}>Плательщики</Typography.Title>
      <Table
        className="payersTable"
        rowKey="address"
        columns={columns}
        dataSource={tableData}
        bordered
        size="small"
        pagination={{
          pageSize: 5,
        }}
        onRow={(record) => ({
          onClick: () => onRowClick(record.address),
        })}
      />
    </div>
  );
};
