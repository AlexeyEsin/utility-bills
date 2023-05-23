import React from 'react';
import Web3 from 'web3';
import { Tag } from 'antd';

import { CONTRACT_ABI } from 'contracts/contractConfig';
import { SelectOption, TBill, TBillStatus, TContractBill, TContractPayer, TCurrency, TPayer } from 'types/types';

export const web3 = new Web3(Web3.givenProvider || process.env.BLOCKCHAIN_HOST);
export const contract = new web3.eth.Contract(CONTRACT_ABI, process.env.CONTRACT_ADDRESS);

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const PAYMENT_PERIOD = 30;

export const getBillStatus = (bill: TContractBill): TBillStatus => {
  if (bill.isPaid) {
    return 'paid';
  }

  const billingTime = new Date(bill.billingDate).getTime();
  const currentTime = new Date().getTime();

  const diffTime = Math.abs(currentTime - billingTime);
  const diffDays = Math.ceil(diffTime / MS_PER_DAY);

  if (diffDays > PAYMENT_PERIOD) {
    return 'overdue';
  }

  return 'unpaid';
};

export const getStatusTag = (status: TBillStatus) => {
  switch (status) {
    case 'overdue':
      return <Tag color="error">Просрочен</Tag>;
    case 'unpaid':
      return <Tag color="warning">Не оплачен</Tag>;
    default:
      return <Tag color="success">Оплачен</Tag>;
  }
};

export const statusPriority: Record<TBillStatus, number> = {
  paid: 0,
  unpaid: 1,
  overdue: 2,
};

export const convertAmount = (amount: string) => {
  if (amount.length > 18) {
    return `${web3.utils.fromWei(`${amount}`, 'ether')} ether`;
  }
  if (amount.length > 15) {
    return `${web3.utils.fromWei(`${amount}`, 'finney')} finney`;
  }
  if (amount.length > 9) {
    return `${web3.utils.fromWei(`${amount}`, 'gwei')} gwei`;
  }
  return `${amount} wei`;
};

export const parseBill = (bill: TContractBill): TBill => ({
  uuid: bill.uuid,
  amount: bill.amount,
  amountWithCurrency: convertAmount(bill.amount),
  isPaid: bill.isPaid,
  billingDate: bill.billingDate,
  paymentDate: bill.paymentDate,
  status: getBillStatus(bill),
});

export const parseBills = (bills: TContractBill[]) => bills.map((bill) => parseBill(bill));
export const parsePayer = (payer: TContractPayer): TPayer => ({
  address: payer.payerAddress,
  name: payer.name,
  billsUuids: payer.billsUuids,
  billsCount: payer.billsUuids.length,
  unpaidBillsCount: Number(payer.unpaidBillsCount),
  unpaidAmount: payer.unpaidAmount,
  unpaidAmountWithCurrency: convertAmount(payer.unpaidAmount),
});

export const parsePayers = (payers: TContractPayer[]) => payers.map((payer) => parsePayer(payer));

export const currencyOptions: SelectOption<TCurrency>[] = [
  { value: 'wei', label: 'Wei' },
  { value: 'gwei', label: 'Gwei' },
  { value: 'finney', label: 'Finney' },
  { value: 'ether', label: 'Ether' },
];
