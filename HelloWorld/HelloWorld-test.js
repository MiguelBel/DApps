var assert = require('assert');
var Web3 = require("web3")
var solc = require("solc")
var fs = require("fs")

var testrpcHost = "http://localhost:8545"
var provider = new Web3.providers.HttpProvider(testrpcHost)
var web3 = new Web3(provider)
var an_adress = web3.eth.accounts[0]

describe('HelloWorld', function() {
  this.timeout(0);

  it('greets the caller', function() {
    expectedGreeting = "Hello World from Smart Contracts"

    deployHelloWorldContract().then(function(_error, deployedContract){
      assert.equal(expectedGreeting, contract.hi.call())
    });
  });
});

var deployHelloWorldContract = function() {
  var filename = "HelloWorld.sol"
  var contractSource = readContract(filename)
  var compiledContracts = solc.compile(contractSource)
  var contract = compiledContracts.contracts[":HelloWorld"]

  var abi = JSON.parse(contract.interface)
  var HelloWorldContract = web3.eth.contract(abi)

  return new Promise(function(){
    HelloWorldContract.new({
      from: an_adress,
      data: contract.bytecode,
      gas: 3000000
    })
  });
}

var readContract = function(filename) {
  var file = fs.readFileSync(filename);
  return file.toString()
}