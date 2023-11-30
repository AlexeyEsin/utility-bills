// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <0.9.0;

contract UtilityBills {
  struct Payer {
    address payerAddress;
    string username;
    string password;
    string firstName;
    string middleName;
    string lastName;
    uint debt;
  }

  struct ShortPayer {
    address payerAddress;
    string firstName;
    string middleName;
    string lastName;
    uint debt;
  }

  address private owner;
  address[] private payersAddresses;
  mapping(address => Payer) private payersDict;

  constructor() {
    owner = msg.sender;
  }

  modifier _ownerOnly() {
    require(msg.sender == owner);
    _;
  }

  function Equals(string memory str1, string memory str2) private pure returns (bool) {
    return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
  }

  function CheckPayerExists(address payerAddress, string memory username) private view returns (uint) {
    for (uint i = 0; i < payersAddresses.length; i++) {
      if (payersAddresses[i] == payerAddress) {
        return 1;
      }
      if (Equals(payersDict[payersAddresses[i]].username, username)) {
        return 2;
      }
    }
    return 0;
  }

  function Register(
    address payerAddress,
    string memory username,
    string memory password,
    string memory firstName,
    string memory middleName,
    string memory lastName
  ) public {
    uint existCode = CheckPayerExists(payerAddress, username);
    require(existCode == 0, string(abi.encodePacked('Request denied! Code: ', existCode)));

    payersDict[payerAddress] = Payer({
      payerAddress: payerAddress,
      username: username,
      password: password,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      debt: 0
    });
    payersAddresses.push(payerAddress);
  }

  function LogIn(string memory username, string memory password) public view returns (bool) {
    Payer storage payer = payersDict[msg.sender];
    require(Equals(payer.username, username) && Equals(payer.password, password), 'Access denied!');
    return true;
  }

  function LogInAsAdmin() public view _ownerOnly returns (bool) {
    if (msg.sender == owner) {
      return true;
    }
    return false;
  }

  function GetPayerInfo(address payerAddress) public view returns (Payer memory) {
    require(msg.sender == owner || msg.sender == payerAddress, 'denied');
    return payersDict[payerAddress];
  }

  function MakePayment() public payable {
    Payer storage payer = payersDict[msg.sender];
    require(msg.value >= payer.debt, 'Not enough funds');
    payer.debt = 0;
  }

  function GetPayers() public view _ownerOnly returns (ShortPayer[] memory) {
    ShortPayer[] memory payersArray = new ShortPayer[](payersAddresses.length);

    for (uint i = 0; i < payersAddresses.length; i++) {
      Payer storage payer = payersDict[payersAddresses[i]];
      payersArray[i] = ShortPayer({
        payerAddress: payer.payerAddress,
        firstName: payer.firstName,
        middleName: payer.middleName,
        lastName: payer.lastName,
        debt: payer.debt
      });
    }
    return payersArray;
  }

  function AddDebt(address payerAddress, uint debtAmount) public _ownerOnly {
    payersDict[payerAddress].debt += debtAmount;
  }

  function AddDebtToAll(uint debtAmount) public _ownerOnly {
    for (uint i = 0; i < payersAddresses.length; i++) {
      AddDebt(payersAddresses[i], debtAmount);
    }
  }

  function GetBalance() public view _ownerOnly returns (uint256) {
    return address(this).balance;
  }

  function Withdraw() public payable _ownerOnly {
    address payable sender = payable(msg.sender);
    sender.transfer(address(this).balance);
  }
}
