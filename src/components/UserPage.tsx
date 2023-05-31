import React, { FC, useEffect, useState } from 'react';
import { message } from 'antd';

import { contract } from 'utils';
import { Header } from './Header';
import { AdminPage } from './AdminPage';
import { PayerPage } from './PayerPage';

type TUserPageProps = {
  address: string;
  isAdmin: boolean;
  onLogOut: VoidFunction;
};

export const UserPage: FC<TUserPageProps> = ({ address, isAdmin, onLogOut }) => {
  const [accountBalance, setAccountBalance] = useState('0');

  const [messageApi, contextHolder] = message.useMessage();

  const getAccountBalance = () => {
    contract.methods
      .GetBalance()
      .call({ from: address })
      .then((balance: string) => setAccountBalance(balance))
      .catch(() => messageApi.open({ type: 'error', content: 'Произошла ошибка' }));
  };

  useEffect(() => {
    if (address && isAdmin) {
      getAccountBalance();
    }
  }, [address, isAdmin]);

  const handleCashOut = () => {
    try {
      contract.methods
        .Withdraw()
        .send({ from: address })
        .then(() => {
          setAccountBalance('0');
        });
    } catch (e) {
      messageApi.open({ type: 'error', content: 'Произошла ошибка' });
    }
  };

  return (
    <>
      {contextHolder}
      <Header isAdmin={isAdmin} accountBalance={accountBalance} onCashOut={handleCashOut} onLogOut={onLogOut} />
      {isAdmin ? <AdminPage address={address} /> : <PayerPage address={address} />}
    </>
  );
};
