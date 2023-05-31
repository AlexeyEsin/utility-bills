import React, { FC } from 'react';
import { Button, Typography } from 'antd';
import { convertAmount } from 'utils';

type THeaderProps = {
  isAdmin: boolean;
  accountBalance: string;
  onCashOut: VoidFunction;
  onLogOut: VoidFunction;
};

export const Header: FC<THeaderProps> = ({ isAdmin, accountBalance, onCashOut, onLogOut }) => (
  <div className="appHeader">
    <Typography.Title>Оплата коммунальных услуг</Typography.Title>
    <div className="buttons">
      {isAdmin && (
        <div className="cashOut">
          <Typography.Text>Средств на счету: {convertAmount(accountBalance)}</Typography.Text>
          <Button type="primary" onClick={onCashOut} disabled={accountBalance === '0'}>
            Вывести
          </Button>
        </div>
      )}
      <Button type="default" onClick={onLogOut}>
        Выйти
      </Button>
    </div>
  </div>
);
