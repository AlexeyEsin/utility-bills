export type TUnit = 'wei' | 'gwei' | 'finney' | 'ether';

export type SelectOption<T> = {
  value: T;
  label: string;
};

export type TBillStatus = 'paid' | 'unpaid' | 'overdue';

export type TContractBill = {
  uuid: string;
  amount: string;
  isPaid: boolean;
  billingDate: string;
  paymentDate: string;
  status: TBillStatus;
};

export type TBill = TContractBill & {
  amountWithUnit: string;
};

export type TContractPayer = {
  payerAddress: string;
  name: string;
  billsUuids: string[];
  unpaidBillsCount: string;
  unpaidAmount: string;
};

export type TPayer = Omit<TContractPayer, 'payerAddress' | 'unpaidBillsCount'> & {
  address: string;
  billsCount: number;
  unpaidBillsCount: number;
  unpaidAmountWithUnit: string;
};
