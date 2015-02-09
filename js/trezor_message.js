'use strict';
var tzMsgs = require('./trezor_messages.js');

var TrezorMessage = function(type, arrayBuffer) {
  this.type = type;
  this.data = arrayBuffer;
}

TrezorMessage.prototype.getMethod = function() {
  // TODO: This is kinda crappy
  var found;
  for(var method in tzMsgs.MessageType) {
    var value = tzMsgs.MessageType[method];
    if(value == this.type) {
      found = method.split('_')[1];
    }
  }
  return found;
}

TrezorMessage.prototype.decode = function() {
  var method = this.getMethod();
  if(!method) {
      return null;
  }
  return tzMsgs[method].decode(this.data);
}

module.exports = TrezorMessage;
