function clearFields() {
  document.querySelector("#label").innerHTML = "[Device disconnected]";
  document.querySelector("#device_id").value = "";
  document.querySelector("#address").value = "";
}

function queryFirstConnectedDevice() {
  clearFields();
  var td = new TrezorDevice();
  td.connect().then(function() {
     document.querySelector("#label").innerHTML = td.features.label;
     document.querySelector("#device_id").value = td.features.device_id;
    return td.send('GetAddress',[td.HARDEN|44, td.HARDEN|0, td.HARDEN|0, 0, 0]);
  }).then(function(message) {
    return new Promise(function(resolve, reject) {
      var getAddress = function(message) {
          var address = message.decode();
          document.querySelector("#address").value = address.address;
          return resolve(address);
      };
      if(message.type == TrezorMessages.MessageType.MessageType_PassphraseRequest) {
          console.log('need passphrase');
        // TODO: don't hard-code passwordlol
        return td.send('PassphraseAck', 'abcdefg').then(function(message) {
            console.log('sent passphrase, got response: ', message);
            return getAddress(message);
        });
      } else {
          console.log('return getAddress', message);
          return getAddress(message);
      }
    });
  }).then(function() {
      return td.send('GetPublicKey', [td.HARDEN|44, td.HARDEN|0, td.HARDEN|0]);
  }).then(function(message) {
    console.log('message: ', message);
    var pubkey = message.decode();
    var xpub = td.processPubkey(pubkey);
    document.querySelector("#xpub").value = xpub;
    return td.disconnect();
  }).catch(function(reason) {
    console.error(reason);
    td.disconnect();
  });
}

window.onload = function() {
  console.log(TrezorMessages);
  document.querySelector("#query-button").addEventListener(
    "click",
    queryFirstConnectedDevice);
  queryFirstConnectedDevice();
};
