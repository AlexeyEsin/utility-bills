import React, { FC, useEffect, useState } from 'react';
import { Button, Typography, message } from 'antd';

import { contract, getFullName, parsePayer } from 'utils';
import type { TContractPayer, TPayer } from 'types/types';

type TPayerPageProps = {
  address: string;
};

export const PayerPage: FC<TPayerPageProps> = ({ address }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [userInfo, setUserInfo] = useState<TPayer | null>(null);

  const getPayerInfo = () => {
    contract.methods
      .GetPayerInfo(address)
      .call({ from: address })
      .then((result: TContractPayer) => setUserInfo(parsePayer(result)))
      .catch(() => messageApi.open({ type: 'error', content: 'Произошла ошибка' }));
  };

  const handleMakePayment = () => {
    contract.methods
      .MakePayment()
      .send({ from: address, value: userInfo?.debt || 0 })
      .then(() => getPayerInfo())
      .catch(() => messageApi.open({ type: 'error', content: 'Произошла ошибка' }));
  };

  useEffect(() => {
    if (address) {
      getPayerInfo();
    }
  }, [address]);

  return (
    <div className="payerPage">
      {contextHolder}
      {userInfo ? (
        <>
          <Typography.Title level={3}>Добро пожаловать, {getFullName(userInfo)}</Typography.Title>
          <div className="debtInfo">
            <Typography.Text>Сумма задолженности: {userInfo.debtWithUnit}</Typography.Text>
            <Button type="primary" onClick={handleMakePayment} disabled={userInfo.debt === 0}>
              Погасить
            </Button>
          </div>
        </>
      ) : (
        <Typography.Title level={3}>Не удалось получить данные об аккаунте</Typography.Title>
      )}
    </div>
  );
};
