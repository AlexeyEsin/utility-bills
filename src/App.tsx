import React, { useEffect, useState } from 'react';
import { Layout, message } from 'antd';

import { web3 } from 'utils';
import { UserPage } from 'components/UserPage';
import { AuthorizationPage } from 'components/AuthorizationPage';

const { Content } = Layout;

export const App = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [address, setAddress] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogIn = () => {
    setIsAuthorized(true);
  };

  const handleLogInAsAdmin = () => {
    setIsAuthorized(true);
    setIsAdmin(true);
  };

  const handleLogOut = () => {
    setIsAuthorized(false);
    setIsAdmin(false);
  };

  const handleAccountChange = () => {
    web3.eth
      .getAccounts()
      .then((accounts) => {
        setAddress(accounts[0]);
        handleLogOut();
      })
      .catch(() => messageApi.open({ type: 'error', content: 'Произошла ошибка' }));
  };

  useEffect(() => {
    const initialize = () => {
      web3.eth
        .requestAccounts()
        .then((accounts) => {
          setAddress(accounts[0]);
          window.ethereum?.on('accountsChanged', handleAccountChange);
        })
        .catch(() => messageApi.open({ type: 'error', content: 'Произошла ошибка' }));
    };

    initialize();

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountChange);
    };
  }, []);

  useEffect(() => {
    const isAuthorizedFromStorage = sessionStorage.getItem('isAuthorized');
    const isAdminFromStorage = sessionStorage.getItem('isAdmin');

    setIsAuthorized(isAuthorizedFromStorage === 'true');
    setIsAdmin(isAdminFromStorage === 'true');
  }, []);

  useEffect(() => {
    sessionStorage.setItem('isAuthorized', String(isAuthorized));
    sessionStorage.setItem('isAdmin', String(isAdmin));
  }, [isAuthorized, isAdmin]);

  return (
    <Layout>
      {contextHolder}
      <Content>
        <div className="mainContainer">
          {isAuthorized ? (
            <UserPage address={address} isAdmin={isAdmin} onLogOut={handleLogOut} />
          ) : (
            <AuthorizationPage address={address} onLogIn={handleLogIn} onLogInAsAdmin={handleLogInAsAdmin} />
          )}
        </div>
      </Content>
    </Layout>
  );
};
