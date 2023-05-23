import React, { useEffect, useState } from 'react';
import { Layout, message } from 'antd';

import { AdminPage } from 'components/AdminPage';
import { PayerPage } from 'components/PayerPage';
import { contract, web3 } from 'utils';
import { Header } from 'components/Header';

const { Content } = Layout;

export const App = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [address, setAddress] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [accountBalance, setAccountBalance] = useState('0');

  const handleAccountChange = async () => {
    const accounts = await web3.eth.getAccounts();
    setAddress(accounts[0]);
  };

  const getAccountBalance = async () => {
    const fetchedBalance = await contract.methods.GetBalance().call({ from: address });
    setAccountBalance(fetchedBalance);
  };

  useEffect(() => {
    const initialize = async () => {
      const accounts = await web3.eth.requestAccounts();
      setAddress(accounts[0]);
      window.ethereum?.on('accountsChanged', handleAccountChange);
    };

    initialize();

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountChange);
    };
  }, []);

  useEffect(() => {
    const isAdminAddress = address === process.env.ADMIN_ADDRESS;
    setIsAdmin(isAdminAddress);

    if (isAdminAddress) {
      getAccountBalance();
    }
  }, [address]);

  const handleCashOut = () => {
    try {
      contract.methods.Withdraw().send({ from: address });
    } catch (e) {
      messageApi.open({ type: 'error', content: 'Произошла ошибка' });
    }
  };

  return (
    <Layout>
      {contextHolder}
      <Content>
        <div className="mainContainer">
          <Header isAdmin={isAdmin} accountBalance={accountBalance} onCashOut={handleCashOut} />
          {isAdmin ? <AdminPage address={address} /> : <PayerPage address={address} />}
        </div>
      </Content>
    </Layout>
  );
};
