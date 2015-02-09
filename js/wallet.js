'use strict';
var tzDev = require('./trezor_device.js'),
    tzMsgs = require('./trezor_messages.js'),
    bitcoin = require('bitcoinjs-lib');

var Wallet = function() {
  this.trezor = new tzDev();
  this.pubkey = null;
  this.hdnode = null;
  this.lastUsedDerivation = -1;
}

Wallet.prototype.init = function() {
  var self = this;
  var td = this.trezor;
  return td.connect().then(function() {
      return td.send('GetPublicKey', [td.HARDEN|44, td.HARDEN|0, td.HARDEN|0]);
  }).then(function(message) {
    return new Promise(function(resolve, reject) {
      var getAddress = function(message) {
          self.pubkey = message.decode();
          self.hdnode = bitcoin.HDNode.fromBase58(self.pubkey.xpub);
          return resolve(message);
      };
      if(message.type == tzMsgs.MessageType.MessageType_PassphraseRequest) {
        // TODO: Ask the user for the real passwordlol
        return td.send('PassphraseAck', 'abcdefg').then(function(message) {
            return getAddress(message);
        });
      } else {
          return getAddress(message);
      }
    });
  }).catch(function(reason) {
    console.error(reason);
  });
}

Wallet.prototype.getNextNode = function() {
  return this.hdnode.derive(0).derive(++this.lastUsedDerivation);
}
Wallet.prototype.getPreviousNode = function() {
  if(this.lastUsedDerivation == 0) { return null };
  return this.hdnode.derive(0).derive(--this.lastUsedDerivation);
}

Wallet.prototype.close = function() { self.trezor.disconnect(); }
Wallet.prototype.getLabel = function() { return this.trezor.features.label; }
Wallet.prototype.getDeviceId = function() { return this.trezor.features.device_id; }
Wallet.prototype.getXpub = function() { return this.hdnode.toBase58(); }

module.exports = Wallet;
