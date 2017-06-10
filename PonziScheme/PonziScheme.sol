pragma solidity ^0.4.11;

contract PonziScheme {
  uint round;
  address lastDepositor;
  uint lastDepositorAmount;

  function PonziScheme() {
    round = 1;
  }

  function deposit() payable {
    uint startingLimit = 1 ether;

    if(round == 1) {
      if(msg.value != startingLimit) {
        throw;
      }
    } else {
      checkAmount(msg.value);

      lastDepositor.send(msg.value);
    }

    lastDepositorAmount = msg.value;
    lastDepositor = msg.sender;

    increaseRound();
  }

  function checkAmount(uint amount) private {
    if(amount != lastDepositorAmount * 2) {
      throw;
    }
  }

  function increaseRound() private {
    round = round + 1;
  }
}