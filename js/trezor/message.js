'use strict';
var Messages = require('./messages.js');

var TrezorMessage = function(type, arrayBuffer) {
  this.type = type;
  this.data = arrayBuffer;
}

TrezorMessage.prototype.getMethod = function() {
  // TODO: This is kinda crappy
  var found;
  for(var method in Messages.MessageType) {
    var value = Messages.MessageType[method];
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
  return Messages[method].decode(this.data);
}

module.exports = TrezorMessage;
