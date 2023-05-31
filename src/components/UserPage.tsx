import React, { FC, useEffect, useState } from 'react';
import { Spin, message } from 'antd';

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
  const [isLoading, setIsLoading] = useState(false);
  const [accountBalance, setAccountBalance] = useState('0');

  const [messageApi, contextHolder] = message.useMessage();

  const getAccountBalance = () => {
    setIsLoading(true);

    contract.methods
      .GetBalance()
      .call({ from: address })
      .then((balance: string) => {
        setAccountBalance(balance);
        setIsLoading(false);
      })
      .catch(() => {
        messageApi.open({ type: 'error', content: 'Произошла ошибка' });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (address && isAdmin) {
      getAccountBalance();
    }
  }, [address, isAdmin]);

  const handleCashOut = () => {
    setIsLoading(true);

    contract.methods
      .Withdraw()
      .send({ from: address })
      .then(() => getAccountBalance())
      .catch(() => {
        messageApi.open({ type: 'error', content: 'Произошла ошибка' });
        setIsLoading(false);
      });
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={isLoading}>
        <Header isAdmin={isAdmin} accountBalance={accountBalance} onCashOut={handleCashOut} onLogOut={onLogOut} />
        {isAdmin ? <AdminPage address={address} /> : <PayerPage address={address} />}
      </Spin>
    </>
  );
};
