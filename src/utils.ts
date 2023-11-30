import Web3 from 'web3';

import { CONTRACT_ABI } from 'contracts/contractConfig';
import { SelectOption, TContractPayer, TUnit, TPayer, TUserData } from 'types/types';

export const web3 = new Web3(Web3.givenProvider || process.env.BLOCKCHAIN_HOST);
export const contract = new web3.eth.Contract(CONTRACT_ABI, process.env.CONTRACT_ADDRESS);

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
  return `${amount || 0} wei`;
};

export const parsePayer = (payer: TContractPayer): TPayer => ({
  address: payer.payerAddress,
  firstName: payer.firstName,
  middleName: payer.middleName,
  lastName: payer.lastName,
  debt: +payer.debt,
  debtWithUnit: convertAmount(payer.debt),
});

export const parsePayers = (payers: TContractPayer[]) => payers.map((payer) => parsePayer(payer));

export const unitOptions: SelectOption<TUnit>[] = [
  { value: 'wei', label: 'Wei' },
  { value: 'gwei', label: 'Gwei' },
  { value: 'finney', label: 'Finney' },
  { value: 'ether', label: 'Ether' },
];

export const InitialUserData: TUserData = {
  address: '',
  username: '',
  password: '',
  firstName: '',
  middleName: '',
  lastName: '',
  debt: 0,
};

export const getFullName = (payer: TPayer) => {
  const { firstName, middleName, lastName } = payer;
  return [lastName, firstName, middleName].join(' ').trim();
};
