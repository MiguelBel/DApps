var Web3 = require("web3")
var solc = require("solc")
var fs = require("fs")

var testrpcHost = "http://localhost:8545"
var provider = new Web3.providers.HttpProvider(testrpcHost)
var web3 = new Web3(provider)

var contractSource = readContract("HelloWorld.sol")
var compiledContract = solc.compile(contractSource)
var abi = JSON.parse(compiledContract.contracts.HelloWorld.interface)
var HelloWorldContract = web3.eth.contract(abi)
var an_adress = web3.eth.accounts[0]
var deployedContract = HelloWorldContract.new({
  from: an_adress,
  data: compiledContract.contracts.HelloWorld.bytecode,
  gas: 3000000
}, function(error, data) {
  if (data.hi) {
    console.log(data.hi.call());
  }
})

function readContract(filename) {
  var file = fs.readFileSync(filename);
  return file.toString()
}