networkSelector = document.getElementById('networkSelection');
contracts.forEach(function(contract){
  option = document.createElement('option');
  option.value = contract.name;
  option.text = contract.name;
  networkSelector.appendChild(option);
});

var setContract = function(contract){
  var endpoint = contract.endpoint;
  var contractAddress = contract.address;

  web3 = new Web3(new Web3.providers.HttpProvider(endpoint));
  contractInstance = getContract(contractAddress, abi);
  contractInstance.blockExplorer = contract.addressBlockExplorer
  
  setInitialState(contractInstance);
}

networkSelector.addEventListener("change", function(){
  contractName = networkSelector.value;

  var contractSelected = contracts.find(function(contract){
    return contract.name == contractName;
  });

  setContract(contractSelected);
});

var contractAddress;
var contractInstance;
var abi = '[{"constant":true,"inputs":[],"name":"round","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"nextAmount","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"startingAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastDepositorAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastDepositor","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_startingAmount","type":"uint256"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"}]'

var setInitialState = function(contractInstance) {
  showContractAddress(contractInstance);
  updateNextAmount(contractInstance);
}

var contribute = function() {
  web3.eth.sendTransaction({
    from: web3.eth.accounts[0],
    to: contractInstance.address,
    value: contractInstance.nextAmount.call()
  }, function(error, txReference){
    if(txReference) {
      showLoadingAlert();
      getTransactionReceiptMined(txReference).then(function(){
        hideLoadingAlert();

        updateNextAmount(contractInstance);
      });
    }
  });
}

var initialContract = contracts[0];
setContract(initialContract);

var duplicateButton = document.getElementById("duplicate");
duplicateButton.addEventListener("click", contribute);
