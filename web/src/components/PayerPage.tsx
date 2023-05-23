import React, { FC, useEffect, useState } from 'react';
import { Typography, message } from 'antd';

import type { TBill, TContractBill } from 'types/types';
import { contract, parseBills } from 'utils';
import { BillsTable } from './BillsTable';

type TPayerPageProps = {
  address: string;
};

export const PayerPage: FC<TPayerPageProps> = ({ address }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [payerName, setPayerName] = useState('');
  const [bills, setBills] = useState<TBill[]>([]);

  const getPayerName = async () => {
    try {
      const fetchedPayerName: string = await contract.methods.GetPayerName(address).call({ from: address });
      setPayerName(fetchedPayerName);
    } catch (e) {
      messageApi.open({ type: 'error', content: 'Произошла ошибка' });
    }
  };

  const getBills = async () => {
    try {
      const fetchedBills: TContractBill[] = await contract.methods.GetPayerBills(address).call({ from: address });
      setBills(parseBills(fetchedBills));
    } catch (e) {
      messageApi.open({ type: 'error', content: 'Произошла ошибка' });
    }
  };

  useEffect(() => {
    if (address) {
      getPayerName().then(() => getBills());
    }
  }, [address]);

  const handleMakePayment = async (billUuid: string, amount: string) => {
    const paymentDate = new Date().toISOString();
    try {
      contract.methods
        .MakePayment(billUuid, paymentDate)
        .send({ from: address, value: amount })
        .then(() => {
          getBills();
        });
    } catch (e) {
      messageApi.open({ type: 'error', content: 'Произошла ошибка' });
    }
  };

  return (
    <div className="payerPageContainer">
      {contextHolder}
      {payerName ? (
        <>
          <Typography.Title level={3}>Добро пожаловать, {payerName}</Typography.Title>
          <BillsTable tableData={bills} isAdmin={false} onMakePayment={handleMakePayment} />
        </>
      ) : (
        <Typography.Title level={3}>Похоже, вы ещё не зарегистрированы в системе</Typography.Title>
      )}
    </div>
  );
};
