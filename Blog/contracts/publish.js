var parameters = process.argv.slice(2);
var eth_endpoint = parameters[0];
var eth_contract = parameters[1];
var ipfsHash = parameters[2];
var publicKey = "a_public";
var privateKey = "a_private";

var Web3 = require("web3");
var EthTx = require("ethereumjs-tx")
var abi = '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"posts","outputs":[{"name":"content","type":"string"},{"name":"time","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getPost","outputs":[{"name":"_ipfsReference","type":"string"},{"name":"time","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"ipfsReference","type":"string"}],"name":"publishPost","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"numberOfPosts","outputs":[{"name":"_count","type":"uint256"}],"payable":false,"type":"function"}]'

var web3 = new Web3(new Web3.providers.HttpProvider(eth_endpoint))
var contractWithAbi = web3.eth.contract(JSON.parse(abi));
var blog = contractWithAbi.at(eth_contract);

data = blog.publishPost.getData(ipfsHash, {
  gas: 1000000
});

var rawTx = {
  nonce: web3.toHex(web3.eth.getTransactionCount(publicKey)),
  gasPrice: web3.toHex(21000000000),
  gasLimit: web3.toHex(1000000),
  data: data
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

console.log('Number of posts: ' + parseInt(blog.numberOfPosts.call()));

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