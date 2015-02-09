var Wallet = function() {
  this.trezor = new TrezorDevice();
  this.pubkey = null;
  this.xpub = null;
}

Wallet.prototype.init = function() {
  var self = this;
  var td = this.trezor;
  return td.connect().then(function() {
      return td.send('GetPublicKey', [td.HARDEN|44, td.HARDEN|0, td.HARDEN|0]);
  }).then(function(message) {
    return new Promise(function(resolve, reject) {
      var getAddress = function(message) {
          var pubkey = message.decode();
          var xpub = self.processPubkey(pubkey);
          self.pubkey = pubkey;
          self.xpub = xpub;
          return resolve(message);
      };
      if(message.type == TrezorMessages.MessageType.MessageType_PassphraseRequest) {
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

Wallet.prototype.processPubkey = function(pubkey) {
  if (pubkey.xpub != null) {
    // As of August 10 firmwares and onward
    return pubkey.xpub;
  }
  // Otherwise we have to do a lot of work.
  var node = pubkey.node;
  var buf = new Buffer.Buffer(78 - 33 - 32);
  buf.writeUInt32BE(0x0488B21E, 0);
  buf.writeUInt8(node.depth, 4);
  buf.writeUInt32BE(node.fingerprint, 5);
  buf.writeUInt32BE(node.child_num, 9);
  buf = Buffer.Buffer.concat(
    [buf,
     new Buffer.Buffer(new Uint8Array(node.chain_code.toBuffer())),
     new Buffer.Buffer(new Uint8Array(node.public_key.toBuffer()))],
    78);
  hdnode = Bitcoin.HDNode.fromBuffer(buf);
  return hdnode.toBase58();
}

Wallet.prototype.close = function() { self.trezor.disconnect(); }
Wallet.prototype.getLabel = function() { return this.trezor.features.label; }
Wallet.prototype.getDeviceId = function() { return this.trezor.features.device_id; }
Wallet.prototype.getXpub = function() { return this.xpub; }
