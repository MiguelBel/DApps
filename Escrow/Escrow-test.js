var assert = require('assert');
var Web3 = require("web3")
var solc = require("solc")
var fs = require("fs")

var testrpcHost = "http://localhost:8545"
var provider = new Web3.providers.HttpProvider(testrpcHost)
var web3 = new Web3(provider)
var an_adress = web3.eth.accounts[0]

describe('Escrow', function() {
  this.timeout(10000);

  it('the contract is initialized with a sender address, payout address and a trusted party address', function(done) {
    var payorAddress = web3.eth.accounts[0]
    var payoutAddress = web3.eth.accounts[1]
    var trustedPartyAddress = web3.eth.accounts[2]
    var amountInEther = 0

    var testInitialAccountsOf = function(data) {
      var contract = data.contract
      assert.equal(contract.payor.call(), payorAddress)
      assert.equal(contract.payout.call(), payoutAddress)
      assert.equal(contract.trustedParty.call(), trustedPartyAddress)
      done()
    }

    deployEscrowContract(payorAddress, payoutAddress, trustedPartyAddress, amountInEther).
      then(data => testInitialAccountsOf(data))
  });

  it('a payout can be made to the payout address by the trusted party address', function(done) {
    var payorAddress = web3.eth.accounts[0]
    var payoutAddress = web3.eth.accounts[1]
    var trustedPartyAddress = web3.eth.accounts[2]
    var amountInEther = 1

    var action = function(data) {
      return new Promise(function(resolve, reject) {
        data.contract.completePayout({ from: trustedPartyAddress })
        resolve(data)
      });
    }

    deployEscrowContract(payorAddress, payoutAddress, trustedPartyAddress, amountInEther).
      then(data => getInitialBalance(data, payoutAddress)).
      then(data => action(data)).
      then(data => expectBalance(payoutAddress, data.initialBalance + amountInEther)).
      then(data => done())
  });

  it('a payout cannot be executed from anyone but the trusted party address', function(done) {
    var payorAddress = web3.eth.accounts[0]
    var payoutAddress = web3.eth.accounts[1]
    var trustedPartyAddress = web3.eth.accounts[2]
    var amountInEther = 1

    var action = function(data) {
      return new Promise(function(resolve, reject) {
        data.contract.completePayout({ from: payoutAddress })

        resolve(data)
      });
    }

    deployEscrowContract(payorAddress, payoutAddress, trustedPartyAddress, amountInEther).
      then(data => getInitialBalance(data, payoutAddress)).
      then(data => action(data)).
      then(data => expectBalance(payoutAddress, data.initialBalance)).
      then(data => done())
  });

  it('a refund can be made to the payout address by the trusted party address', function(done) {
    var payorAddress = web3.eth.accounts[0]
    var payoutAddress = web3.eth.accounts[1]
    var trustedPartyAddress = web3.eth.accounts[2]
    var transactionValueInEther = 1

    var action = function(data) {
      return new Promise(function(resolve, reject) {
        data.contract.refund({ from: trustedPartyAddress })
        resolve(data)
      });
    }

    deployEscrowContract(payorAddress, payoutAddress, trustedPartyAddress, transactionValueInEther).
      then(data => getInitialBalance(data, payorAddress)).
      then(data => action(data)).
      then(data => expectBalance(payorAddress, data.initialBalance + transactionValueInEther)).
      then(data => done())
  });

  it('a refund cannot be executed from anyone but the trusted party address', function(done) {
    var payorAddress = web3.eth.accounts[0]
    var payoutAddress = web3.eth.accounts[1]
    var trustedPartyAddress = web3.eth.accounts[2]
    var transactionValueInEther = 1

    var action = function(data) {
      return new Promise(function(resolve, reject) {
        data.contract.refund({ from: payorAddress })
        resolve(data)
      });
    }

    deployEscrowContract(payorAddress, payoutAddress, trustedPartyAddress, transactionValueInEther).
      then(data => getInitialBalance(data, payorAddress)).
      then(data => action(data)).
      then(data => expectBalance(payorAddress, data.initialBalance)).
      then(data => done())
  });

  var getInitialBalance = function(data, address) {
    return new Promise(function(resolve, reject) {
      estimatedBalanceInEther(address, function(initialBalance){
        data.initialBalance = initialBalance

        resolve(data)
      });
    });
  }

  var expectBalance = function(address, amount) {
    return new Promise(function(resolve, reject) {
      estimatedBalanceInEther(address, function(finalBalance){
        assert.equal(finalBalance, amount);

        resolve()
      });
    });
  }
});

var estimatedBalanceInEther = function(address, callback) {
  web3.eth.getBalance(address, function(error, balanceInWei){
    if(balanceInWei) {
      var inEther = web3.fromWei(balanceInWei, "ether")

      callback(Math.round(inEther.toNumber()))
    }
  });
}

var deployEscrowContract = function(payorAddress, payoutAddress, trustedPartyAddress, etherAmount) {
  var name = "Escrow"
  var filename = name + ".sol"
  var contractSource = readContract(filename)
  var compiledContracts = solc.compile(contractSource)

  if(compiledContracts.contracts == undefined) {
    throw "Contract compilation error: " + compiledContracts.errors.join("\n")
  }

  var contractReference = ":" + name
  var contract = compiledContracts.contracts[contractReference]

  var abi = JSON.parse(contract.interface)
  var facedContract = web3.eth.contract(abi)

  return new Promise(function(resolve, reject) {
    facedContract.new(payoutAddress, trustedPartyAddress, {
      from: payorAddress,
      data: contract.bytecode,
      gas: 3000000,
      value: web3.toWei(etherAmount, "ether")
    }, function(error, contract){
      if(contract.address) {
        resolve({ contract: contract })
      }
    })
  });
}

var readContract = function(filename) {
  var file = fs.readFileSync(filename);
  return file.toString()
}