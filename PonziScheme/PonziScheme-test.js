var assert = require('assert');
var Web3 = require("web3")
var solc = require("solc")
var fs = require("fs")

var testrpcHost = "http://localhost:8545"
var provider = new Web3.providers.HttpProvider(testrpcHost)
var web3 = new Web3(provider)
var an_adress = web3.eth.accounts[0]

describe("PonziScheme", function(){
  this.timeout(10000);

  it('the first deposit must be 1 ETH', function(done){
    var firstDeposit = {
      address: web3.eth.accounts[0],
      amountInEther: 1
    }

    var action = function(data) {
      return new Promise(function(resolve, reject) {
        setDeposit(data, firstDeposit.address, firstDeposit.amountInEther)

        resolve(data)
      });
    }

    deployPonziSchemeContract(firstDeposit.address).

      then(data => action(data)).
      then(data => expectBalance(data, data.contract.address, firstDeposit.amountInEther)).
      then(data => done())
  });

  it('the first deposit cannot be more than 1 ETH', function(done){
    var firstDeposit = {
      address: web3.eth.accounts[0],
      amountInEther: 2
    }
    var zeroBalance = 0

    var action = function(data) {
      return new Promise(function(resolve, reject) {
        setDeposit(data, firstDeposit.address, firstDeposit.amountInEther)

        resolve(data)
      });
    }

    deployPonziSchemeContract(firstDeposit.address).

      then(data => action(data)).
      then(data => expectBalance(data, data.contract.address, zeroBalance)).
      then(data => done())
  });

  it('the first deposit cannot be less than 1 ETH', function(done){
    var firstDeposit = {
      address: web3.eth.accounts[0],
      amountInEther: 0.5
    }
    var zeroBalance = 0

    var action = function(data) {
      return new Promise(function(resolve, reject) {
        setDeposit(data, firstDeposit.address, firstDeposit.amountInEther)

        resolve(data)
      });
    }

    deployPonziSchemeContract(firstDeposit.address).

      then(data => action(data)).
      then(data => expectBalance(data, data.contract.address, zeroBalance)).
      then(data => done())
  });

  it('the second deposit must be 2 ETH and double of the first deposit should be returned to the first depositor', function(done){
    var firstDeposit = {
      address: web3.eth.accounts[0],
      amountInEther: 1
    }
    var secondDeposit = {
      address: web3.eth.accounts[1],
      amountInEther: 2
    }

    var action = function(data) {
      return new Promise(function(resolve, reject) {
        setDeposit(data, secondDeposit.address, secondDeposit.amountInEther)

        resolve(data)
      });
    }

    deployPonziSchemeContract(firstDeposit.address).

      then(data => setDeposit(data, firstDeposit.address, firstDeposit.amountInEther)).
      then(data => getInitialBalance(data, firstDeposit.address)).
      then(data => action(data)).
      then(data => expectBalance(data, data.contract.address, firstDeposit.amountInEther)).
      then(data => expectBalance(data, firstDeposit.address, data.initialBalance + firstDeposit.amountInEther * 2)).
      then(data => done())
  });

  it('the second deposit cannot be more than 2 ETH', function(done){
    var firstDeposit = {
      address: web3.eth.accounts[0],
      amountInEther: 1
    }
    var secondDeposit = {
      address: web3.eth.accounts[1],
      amountInEther: 3
    }

    var action = function(data) {
      return new Promise(function(resolve, reject) {
        setDeposit(data, secondDeposit.address, secondDeposit.amountInEther)

        resolve(data)
      });
    }

    deployPonziSchemeContract(firstDeposit.address).

      then(data => setDeposit(data, firstDeposit.address, firstDeposit.amountInEther)).
      then(data => getInitialBalance(data, firstDeposit.address)).
      then(data => action(data)).
      then(data => expectBalance(data, data.contract.address, firstDeposit.amountInEther)).
      then(data => expectBalance(data, firstDeposit.address, data.initialBalance)).
      then(data => done())
  });

  it('the second deposit cannot be less than 2 ETH', function(done){
    var firstDeposit = {
      address: web3.eth.accounts[0],
      amountInEther: 1
    }
    var secondDeposit = {
      address: web3.eth.accounts[1],
      amountInEther: 1
    }

    var action = function(data) {
      return new Promise(function(resolve, reject) {
        setDeposit(data, secondDeposit.address, secondDeposit.amountInEther)

        resolve(data)
      });
    }

    deployPonziSchemeContract(firstDeposit.address).

      then(data => setDeposit(data, firstDeposit.address, firstDeposit.amountInEther)).
      then(data => getInitialBalance(data, firstDeposit.address)).
      then(data => action(data)).
      then(data => expectBalance(data, data.contract.address, firstDeposit.amountInEther)).
      then(data => expectBalance(data, firstDeposit.address, data.initialBalance)).
      then(data => done())
  });

  it('the third deposit must be 4 ETH and double of the second deposit should be returned to the second depositor', function(done){
    var firstDeposit = {
      address: web3.eth.accounts[0],
      amountInEther: 1
    }
    var secondDeposit = {
      address: web3.eth.accounts[1],
      amountInEther: 2
    }
    var thirdDeposit = {
      address: web3.eth.accounts[2],
      amountInEther: 4
    }

    var action = function(data) {
      return new Promise(function(resolve, reject) {
        setDeposit(data, thirdDeposit.address, thirdDeposit.amountInEther)

        resolve(data)
      });
    }

    deployPonziSchemeContract(firstDeposit.address).

      then(data => setDeposit(data, firstDeposit.address, firstDeposit.amountInEther)).
      then(data => setDeposit(data, secondDeposit.address, secondDeposit.amountInEther)).
      then(data => getInitialBalance(data, secondDeposit.address)).
      then(data => action(data)).
      then(data => expectBalance(data, secondDeposit.address, data.initialBalance + secondDeposit.amountInEther * 2)).
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

  var setDeposit = function(data, address, amount) {
    return new Promise(function(resolve, reject) {
      try {
        web3.eth.sendTransaction({
          to: data.contract.address,
          from: address,
          value: web3.toWei(amount, "ether")
        });
      } catch(e) {
        var notPerformedOperation = 'VM Exception while processing transaction: invalid opcode'

        if (e.message != notPerformedOperation) {
          throw e
        }
      }

      resolve(data)
    });
  }

  var expectBalance = function(data, address, amount) {
    return new Promise(function(resolve, reject) {
      estimatedBalanceInEther(address, function(finalBalance){
        assert.equal(finalBalance, amount);

        resolve(data)
      });
    });
  }
});

var deployPonziSchemeContract = function(address) {
  var name = "PonziScheme"
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
    facedContract.new(address, {
      from: address,
      data: contract.bytecode,
      gas: 3000000
    }, function(error, contract){
      if(error) { console.log(error) }
      if(contract.address) {
        resolve({ contract: contract })
      }
    })
  });
}

var estimatedBalanceInEther = function(address, callback) {
  web3.eth.getBalance(address, function(error, balanceInWei){
    if(balanceInWei) {
      var inEther = web3.fromWei(balanceInWei, "ether")

      callback(Math.round(inEther.toNumber()))
    }
  });
}

var readContract = function(filename) {
  var file = fs.readFileSync(filename);
  return file.toString()
}
