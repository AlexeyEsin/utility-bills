import { AbiItem } from 'web3-utils';

export const CONTRACT_ABI: AbiItem[] = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'payerAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'username',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'password',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'firstName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'middleName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'lastName',
        type: 'string',
      },
    ],
    name: 'Register',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'username',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'password',
        type: 'string',
      },
    ],
    name: 'LogIn',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'LogInAsAdmin',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'payerAddress',
        type: 'address',
      },
    ],
    name: 'GetPayerInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'payerAddress',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'username',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'password',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'firstName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'middleName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'lastName',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'debt',
            type: 'uint256',
          },
        ],
        internalType: 'struct UtilityBills.Payer',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'MakePayment',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
  {
    inputs: [],
    name: 'GetPayers',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'payerAddress',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'firstName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'middleName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'lastName',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'debt',
            type: 'uint256',
          },
        ],
        internalType: 'struct UtilityBills.ShortPayer[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'payerAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'debtAmount',
        type: 'uint256',
      },
    ],
    name: 'AddDebt',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'debtAmount',
        type: 'uint256',
      },
    ],
    name: 'AddDebtToAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GetBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'Withdraw',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
];
