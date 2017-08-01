var publicKey = "public"
var privateKey = "private";
var endpoint = "https://ropsten.infura.io/";
var title = "My immutable blog";

var fs = require("fs")
var Web3 = require("web3")
var EthTx = require("ethereumjs-tx")
var solc = require("solc")

var readContract = function(filename) {
  var file = fs.readFileSync(filename);
  return file.toString()
}

var web3 = new Web3(new Web3.providers.HttpProvider(endpoint))

var name = "Blog"
var filename = name + ".sol"
var contractSource = readContract(filename)
var compiledContracts = solc.compile(contractSource)

console.log(compiledContracts);
if(compiledContracts.contracts == undefined) {
  throw "Contract compilation error: " + compiledContracts.errors.join("\n")
}

var contractReference = ":" + name
var contract = compiledContracts.contracts[contractReference]

var abi = JSON.parse(contract.interface)
var facedContract = web3.eth.contract(abi)

var bytecode = contract.bytecode
var rawContractData = facedContract.new.getData(title, {
  data: '0x' + bytecode
});

var rawTx = {
  nonce: web3.toHex(web3.eth.getTransactionCount(publicKey)),
  gasPrice: web3.toHex(21000000000),
  gasLimit: web3.toHex(1000000),
  data: rawContractData
}

var tx = new EthTx(rawTx)
var privateKeyx = new Buffer(privateKey, 'hex')
tx.sign(privateKeyx)
var serializedTx = '0x' + tx.serialize().toString('hex')

web3.eth.sendRawTransaction(serializedTx, function(error, txReference){
  console.log('Transaction: ' + txReference);

  console.log('Waiting for the transaction to be mined...')

  getTransactionReceiptMined(txReference).then(function(data){
    console.log('Contract address: ' + data.contractAddress);
  });
});

var getTransactionReceiptMined = function (txnHash, interval) {
    var transactionReceiptAsync;
    interval = interval ? interval : 500;
    transactionReceiptAsync = function(txnHash, resolve, reject) {
        web3.eth.getTransactionReceipt(txnHash, (error, receipt) => {
            if (error) {
                reject(error);
            } else {
                if (receipt == null) {
                    setTimeout(function () {
                        transactionReceiptAsync(txnHash, resolve, reject);
                    }, interval);
                } else {
                    resolve(receipt);
                }
            }
        });
    };

    if (Array.isArray(txnHash)) {
        var promises = [];
        txnHash.forEach(function (oneTxHash) {
            promises.push(web3.eth.getTransactionReceiptMined(oneTxHash, interval));
        });
        return Promise.all(promises);
    } else {
        return new Promise(function (resolve, reject) {
                transactionReceiptAsync(txnHash, resolve, reject);
            });
    }
};