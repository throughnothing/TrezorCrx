var w = new Wallet();

function clearFields() {
  document.querySelector("#device_label").innerHTML = "[Device disconnected]";
  document.querySelector("#device_id").value = "";
  document.querySelector("#xpub").value = "";
}

function previousAddress() {
  var node = w.getPreviousNode();
  document.querySelector("#address-label").innerHTML = 'Address ' + w.lastUsedDerivation + ':';
  document.querySelector("#address").value = node.pubKey.getAddress();
}

function nextAddress() {
  var node = w.getNextNode();
  document.querySelector("#address-label").innerHTML = 'Address ' + w.lastUsedDerivation + ':';
  document.querySelector("#address").value = node.pubKey.getAddress();
}


function queryFirstConnectedDevice() {
  clearFields();
  w.init().then(function() {
      document.querySelector("#device_label").innerHTML = w.getLabel();
      document.querySelector("#device_id").value = w.getDeviceId();
      document.querySelector("#xpub").value = w.getXpub();
      nextAddress();
  });
}

window.onload = function() {
  document.querySelector("#query-button").addEventListener(
    "click",
    queryFirstConnectedDevice);
  document.querySelector("#next-address-button").addEventListener(
      "click",
      nextAddress);
  document.querySelector("#previous-address-button").addEventListener(
      "click",
      previousAddress);
  queryFirstConnectedDevice();
};
