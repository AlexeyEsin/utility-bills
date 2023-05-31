import React, { FC, useEffect, useState } from 'react';
import { Button, Spin, message } from 'antd';

import type { TContractPayer, TUnit, TPayer } from 'types/types';
import { contract, parsePayers, web3 } from 'utils';
import { PayersTable } from './PayersTable';
import { IssueBillModal } from './IssueBillModal';

type TAdminPageProps = {
  address: string;
};

export const AdminPage: FC<TAdminPageProps> = ({ address }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayer, setSelectedPayer] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'single' | 'all'>('single');
  const [payers, setPayers] = useState<TPayer[]>([]);

  const getPayers = () => {
    setIsLoading(true);

    contract.methods
      .GetPayers()
      .call({ from: address })
      .then((fetchedPayers: TContractPayer[]) => {
        setPayers(parsePayers(fetchedPayers));
        setIsLoading(false);
      })
      .catch(() => {
        messageApi.open({ type: 'error', content: 'Произошла ошибка' });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (address) {
      getPayers();
    }
  }, [address]);

  const handleOpenModalSingle = (payerAddress: string) => {
    setSelectedPayer(payerAddress);
    setModalType('single');
    setIsModalOpen(true);
  };

  const handleOpenModalAll = () => {
    setModalType('all');
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const addDebt = (debtAmount: number, unit: TUnit) => {
    setIsModalOpen(false);
    setIsLoading(true);
    const convertedAmount = web3.utils.toWei(`${debtAmount}`, unit);

    if (modalType === 'single') {
      contract.methods
        .AddDebt(selectedPayer, convertedAmount)
        .send({ from: address })
        .then(() => {
          getPayers();
          setIsLoading(false);
        })
        .catch(() => {
          messageApi.open({ type: 'error', content: 'Произошла ошибка' });
          setIsLoading(false);
        });
    } else {
      contract.methods
        .AddDebtToAll(convertedAmount)
        .send({ from: address })
        .then(() => {
          getPayers();
          setIsLoading(false);
        })
        .catch(() => {
          messageApi.open({ type: 'error', content: 'Произошла ошибка' });
          setIsLoading(false);
        });
    }
  };

  return (
    <Spin spinning={isLoading}>
      <div className="adminPage">
        {contextHolder}
        <PayersTable tableData={payers} onIssueBill={handleOpenModalSingle} />
        <Button className="debtAll" type="primary" onClick={handleOpenModalAll} disabled={!payers.length}>
          Выставить счёт всем
        </Button>
        <IssueBillModal isOpen={isModalOpen} onOk={addDebt} onCancel={handleModalCancel} />
      </div>
    </Spin>
  );
};
