var setContract = function(contract){
  var endpoint = contract.endpoint;
  var contractAddress = contract.address;

  if (typeof web3 !== 'undefined') {
     window.web3 = new Web3(web3.currentProvider);
   } else {
     console.log('No web3? You should consider trying MetaMask!')
   }

   var networkContainer = document.getElementById('networkName');
   networkContainer.innerHTML = contract.name;

  contractInstance = getContract(contractAddress, abi);
  contractInstance.blockExplorer = contract.addressBlockExplorer

  setInitialState(contractInstance);
}

var contractAddress;
var contractInstance;
var abi = '[{"constant":true,"inputs":[],"name":"round","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"nextAmount","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"startingAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastDepositorAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastDepositor","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_startingAmount","type":"uint256"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"}]'

var setInitialState = function(contractInstance) {
  showContractAddress(contractInstance);
  updateNextAmount(contractInstance);
}

var contribute = function() {
  contractInstance.nextAmount.call(function(error, nextAmount){
    web3.eth.sendTransaction({
      from: web3.eth.accounts[0],
      to: contractInstance.address,
      value: nextAmount
    }, function(error, txReference){
      if(txReference) {
        showLoadingAlert();
        getTransactionReceiptMined(txReference).then(function(){
          hideLoadingAlert();

          updateNextAmount(contractInstance);
        });
      }
    });
  });
}
window.addEventListener('load', function() {
  web3.version.getNetwork((err, networkId) => {
    if(networkId > 5) {
      networkId = 0; // Local development indicated with 0
    }

    var initialContract = contracts.find(function(contract){
      return contract.networkId == networkId;
    });

    setContract(initialContract);

    var duplicateButton = document.getElementById("duplicate");
    duplicateButton.addEventListener("click", contribute);
  });
});
