// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <0.9.0;

contract UtilityBills {
    struct Bill {
        string uuid;
        uint amount;
        bool isPaid;
        string billingDate;
        string paymentDate;
    }

    struct Payer {
        address payerAddress;
        string name;
        string[] billsUuids;
        uint unpaidBillsCount;
        uint unpaidAmount;
    }

    address private owner;
    address[] private payersAddresses;
    mapping(address => Payer) private payersDict;
    mapping(string => Bill) private billsDict;

    constructor() {
        owner = msg.sender;
    }

    modifier _ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    function CheckPayerExists(
        address payerAddress
    ) private view returns (bool) {
        for (uint i = 0; i < payersAddresses.length; i++) {
            if (payersAddresses[i] == payerAddress) {
                return true;
            }
        }
        return false;
    }

    function AddPayer(
        address payerAddress,
        string memory payerName
    ) public _ownerOnly {
        string[] memory billsUuids = new string[](0);

        payersDict[payerAddress] = Payer({
            payerAddress: payerAddress,
            name: payerName,
            billsUuids: billsUuids,
            unpaidBillsCount: 0,
            unpaidAmount: 0
        });
        payersAddresses.push(payerAddress);
    }

    function AddBill(
        address payerAddress,
        string memory billUuid,
        string memory billingDate,
        uint billAmount
    ) public _ownerOnly {
        billsDict[billUuid] = Bill({
            uuid: billUuid,
            amount: billAmount,
            isPaid: false,
            billingDate: billingDate,
            paymentDate: ""
        });

        payersDict[payerAddress].billsUuids.push(billUuid);
        payersDict[payerAddress].unpaidBillsCount += 1;
        payersDict[payerAddress].unpaidAmount += billAmount;
    }

    function MakePayment(
        string memory billUuid,
        string memory paymentDate
    ) public payable {
        Bill storage billRef = billsDict[billUuid];
        require(msg.value >= billRef.amount, "Not enough funds");
        billRef.isPaid = true;
        billRef.paymentDate = paymentDate;

        payersDict[msg.sender].unpaidBillsCount -= 1;
        payersDict[msg.sender].unpaidAmount -= billRef.amount;
    }

    function GetPayers() public view _ownerOnly returns (Payer[] memory) {
        Payer[] memory payersArray = new Payer[](payersAddresses.length);
        for (uint i = 0; i < payersAddresses.length; i++) {
            payersArray[i] = payersDict[payersAddresses[i]];
        }
        return payersArray;
    }

    function GetPayerName(
        address payerAddress
    ) public view returns (string memory) {
        if (CheckPayerExists(payerAddress)) {
            return payersDict[payerAddress].name;
        }
        return "";
    }

    function GetPayerBills(
        address payerAddress
    ) public view returns (Bill[] memory) {
        require(
            msg.sender == owner || msg.sender == payerAddress,
            "Wrong address"
        );

        Payer storage payer = payersDict[payerAddress];
        Bill[] memory billsArray = new Bill[](payer.billsUuids.length);

        for (uint i = 0; i < payer.billsUuids.length; i++) {
            string memory billUuid = payer.billsUuids[i];
            billsArray[i] = billsDict[billUuid];
        }
        return billsArray;
    }

    function GetBalance() public view _ownerOnly returns (uint256) {
        return address(this).balance;
    }

    function Withdraw() public payable _ownerOnly {
        address payable sender = payable(msg.sender);
        sender.transfer(address(this).balance);
    }
}
