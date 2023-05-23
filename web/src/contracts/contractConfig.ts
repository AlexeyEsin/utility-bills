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
        name: 'payerName',
        type: 'string',
      },
    ],
    name: 'AddPayer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
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
        name: 'billUuid',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'billingDate',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'billAmount',
        type: 'uint256',
      },
    ],
    name: 'AddBill',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'billUuid',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'paymentDate',
        type: 'string',
      },
    ],
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
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string[]',
            name: 'billsUuids',
            type: 'string[]',
          },
          {
            internalType: 'uint256',
            name: 'unpaidBillsCount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'unpaidAmount',
            type: 'uint256',
          },
        ],
        internalType: 'struct UtilityBills.Payer[]',
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
    ],
    name: 'GetPayerName',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
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
    name: 'GetPayerBills',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'uuid',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isPaid',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'billingDate',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'paymentDate',
            type: 'string',
          },
        ],
        internalType: 'struct UtilityBills.Bill[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
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
