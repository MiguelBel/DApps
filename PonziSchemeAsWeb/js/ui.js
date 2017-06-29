var showLoadingAlert = function() {
  var loadingAlert = document.getElementById("loading");
  loadingAlert.style = 'display: block;';
}

var hideLoadingAlert = function() {
  var loadingAlert = document.getElementById("loading");
  loadingAlert.style = 'display: none;'
}

var showContractAddress = function(contract) {
  var addressContainer = document.getElementById("address");
  addressContainer.innerHTML = contract.address;
}

var updateNextAmount = function(contract) {
  var amountInWei = contract.nextAmount.call();
  var nextAmount = web3.fromWei(amountInWei, "ether");
  var nextAmountContainer = document.getElementById("nextAmount");
  nextAmountContainer.innerHTML = nextAmount;
}
