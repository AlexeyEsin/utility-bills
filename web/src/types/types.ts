export type TUnit = 'wei' | 'gwei' | 'finney' | 'ether';

export type SelectOption<T> = {
  value: T;
  label: string;
};

export type TContractPayer = {
  payerAddress: string;
  firstName: string;
  middleName: string;
  lastName: string;
  debt: string;
};

export type TPayer = Omit<TContractPayer, 'payerAddress' | 'debt'> & {
  address: string;
  debt: number;
  debtWithUnit: string;
};

export type TUserData = {
  address: string;
  username: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  debt: number;
};
