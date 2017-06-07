pragma solidity ^0.4.11;

contract Escrow {
  address public payor;
  address public payout;
  address public trustedParty;

  function Escrow(address _payout, address _trustedParty) payable {
    payor = msg.sender;
    payout = _payout;
    trustedParty = _trustedParty;
  }

  function completePayout() {
    if(msg.sender == trustedParty) {
      payout.send(this.balance);
    }
  }

  function refund() {
    if(msg.sender == trustedParty) {
      payor.send(this.balance);
    }
  }
}