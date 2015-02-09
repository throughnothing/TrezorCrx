function clearFields() {
  document.querySelector("#label").innerHTML = "[Device disconnected]";
  document.querySelector("#device_id").value = "";
  document.querySelector("#xpub").value = "";
}

function queryFirstConnectedDevice() {
  clearFields();
  var w = new Wallet();
  w.init().then(function() {
      document.querySelector("#label").innerHTML = w.getLabel();
      document.querySelector("#device_id").value = w.getDeviceId();
      document.querySelector("#xpub").value = w.getXpub();
  });
}

window.onload = function() {
  document.querySelector("#query-button").addEventListener(
    "click",
    queryFirstConnectedDevice);
  queryFirstConnectedDevice();
};
