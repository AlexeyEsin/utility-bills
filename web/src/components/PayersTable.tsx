import React, { FC } from 'react';
import { Button, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { TPayer } from 'types/types';
import { getFullName } from 'utils';

type TPayersTableProps = {
  tableData: TPayer[];
  onIssueBill: (payerAddress: string) => void;
};

export const PayersTable: FC<TPayersTableProps> = ({ tableData, onIssueBill }) => {
  const columns: ColumnsType<TPayer> = [
    {
      title: 'Адрес в Блокчейн',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'ФИО плательщика',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => getFullName(a).localeCompare(getFullName(b)),
      render: (_, record) => getFullName(record),
    },
    {
      title: 'Сумма задолженности',
      dataIndex: 'debtWithUnit',
      key: 'debtWithUnit',
      sorter: (a, b) => a.debt - b.debt,
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
    <div>
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
      />
    </div>
  );
};
