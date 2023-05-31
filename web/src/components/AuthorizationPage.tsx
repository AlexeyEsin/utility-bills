import React, { FC, useState } from 'react';

import { LogIn } from './LogIn';
import { Register } from './Register';

type TPageType = 'login' | 'register';

type TAuthorizationPageProps = {
  address: string;
  onLogIn: VoidFunction;
  onLogInAsAdmin: VoidFunction;
};

export const AuthorizationPage: FC<TAuthorizationPageProps> = ({ address, onLogIn, onLogInAsAdmin }) => {
  const [pageType, setPageType] = useState<TPageType>('login');

  const toRegisterPage = () => {
    setPageType('register');
  };

  const toLogInPage = () => {
    setPageType('login');
  };

  return pageType === 'login' ? (
    <LogIn address={address} onLogIn={onLogIn} onLogInAsAdmin={onLogInAsAdmin} toRegisterPage={toRegisterPage} />
  ) : (
    <Register userAddress={address} toLogInPage={toLogInPage} />
  );
};
