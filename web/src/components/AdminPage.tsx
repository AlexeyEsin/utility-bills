import React, { FC, useEffect, useState } from 'react';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import type { TBill, TContractBill, TContractPayer, TCurrency, TPayer } from 'types/types';
import { contract, parseBills, parsePayers, web3 } from 'utils';
import { PayersTable } from './PayersTable';
import { AddPayerForm } from './AddPayerForm';
import { BillsTable } from './BillsTable';
import { IssueBillModal } from './IssueBillModal';

type TAdminPageProps = {
  address: string;
};

export const AdminPage: FC<TAdminPageProps> = ({ address }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [selectedPayer, setSelectedPayer] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payers, setPayers] = useState<TPayer[]>([]);
  const [bills, setBills] = useState<TBill[]>([]);

  const getPayers = async () => {
    try {
      const fetchedPayers: TContractPayer[] = await contract.methods.GetPayers().call({ from: address });
      setPayers(parsePayers(fetchedPayers));
    } catch (e) {
      messageApi.open({ type: 'error', content: 'Произошла ошибка' });
    }
  };

  useEffect(() => {
    getPayers();
  }, []);

  const handleAddPayer = async (payer: TPayer) => {
    const payerAddress = payer.address.trim();

    if (!web3.utils.isAddress(payerAddress)) {
      messageApi.open({ type: 'error', content: 'Некорректный адрес' });
      return;
    }
    if (payers.some((p) => p.address === payerAddress)) {
      messageApi.open({ type: 'error', content: 'Плательщик с таким адресом уже существует' });
      return;
    }

    try {
      contract.methods
        .AddPayer(payer.address, payer.name)
        .send({ from: address })
        .then(() => {
          setPayers((prev) => [
            ...prev,
            {
              ...payer,
              billsUuids: [],
              billsCount: 0,
              unpaidBillsCount: 0,
              unpaidAmount: '0',
              unpaidAmountWithCurrency: '0 wei',
            },
          ]);
        });
    } catch (e) {
      messageApi.open({ type: 'error', content: 'Произошла ошибка' });
    }
  };

  const handleOpenModal = (payerAddress: string) => {
    setSelectedPayer(payerAddress);
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setSelectedPayer('');
    setIsModalOpen(false);
  };

  const handleModalOk = (billAmount: number, currency: TCurrency) => {
    const convertedAmount = web3.utils.toWei(`${billAmount}`, currency);
    const billUuid = uuidv4();
    const billingDate = new Date().toISOString();

    try {
      contract.methods
        .AddBill(selectedPayer, billUuid, billingDate, convertedAmount)
        .send({ from: address })
        .then(() => {
          getPayers();
        });
    } catch (e) {
      messageApi.open({ type: 'error', content: 'Произошла ошибка' });
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleRowClick = async (payerAddress: string) => {
    try {
      const fetchedBills: TContractBill[] = await contract.methods.GetPayerBills(payerAddress).call({ from: address });
      setBills(parseBills(fetchedBills));
    } catch (e) {
      messageApi.open({ type: 'error', content: 'Произошла ошибка' });
    }
  };

  return (
    <div className="adminPageContainer">
      {contextHolder}
      <PayersTable tableData={payers} onIssueBill={handleOpenModal} onRowClick={handleRowClick} />
      <AddPayerForm onAdd={handleAddPayer} />
      <BillsTable tableData={bills} isAdmin />
      <IssueBillModal isOpen={isModalOpen} onOk={handleModalOk} onCancel={handleModalCancel} />
    </div>
  );
};
