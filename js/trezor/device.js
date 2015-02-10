'use strict';
var Messages = require('./messages.js'),
    Message  = require('./message.js'),
    ProtoBuf = require('protobufjs'),
    ByteBuffer = ProtoBuf.ByteBuffer;


// Trezor Values
var vendorId = 0x534c;
var productId = 0x0001;

var TrezorDevice = function() {
    this.HARDEN = 0x80000000;

    this.connectionId = null;
    this.deviceId = null;
    this.features = null;
    this.reportId = 63; // TODO: where did this number come from?!
};

TrezorDevice.prototype._padByteArray = function(sequence, size) {
    var newArray = new Uint8Array(size);
    newArray.set(sequence);
    return newArray;
}

TrezorDevice.prototype.connect = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.getDevice().then(function(deviceId) {
        chrome.hid.connect(deviceId, function(connection) {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
          } else {
            self.connectionId = connection.connectionId
            resolve(self);
          }
        });
      });
  // TODO: not sure what these are for yet
  //}).then(function() {
      //return self.sendFeatureReport(0x41, 0x01);
  //}).then(function() {
      //return self.sendFeatureReport(0x43, 0x03);
  }).then(function() {
      return self.send('Initialize');
  }).then(function(message) {
    self.features = message.decode();
    return self;
  });
}

TrezorDevice.prototype.disconnect = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    if (self.connectionId == null) {
      resolve();
      return;
    }
    chrome.hid.disconnect(self.connectionId, function() {
      self.connectionId = null;
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        console.log("Trezor disconnected");
        resolve();
      }
    });
  });
}

TrezorDevice.prototype.getDevice = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    chrome.hid.getDevices(
      {vendorId: vendorId, productId: productId },
      function(devices) {
        if (!devices || devices.length == 0) {
          reject("No device found.");
        } else {
          // TODO: handle multiple devices
          self.deviceId = devices[0].deviceId;
          resolve(devices[0].deviceId);
        }
      });
  });
}

TrezorDevice.prototype.sendFeatureReport = function(value) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var data = self._padByteArray([value], 1);
    chrome.hid.sendFeatureReport(
      self.connectionId,
      self.reportId,
      data.buffer,
      function() {
        // Ignore failure because the device is bad at HID.
        resolve();
      });
  });
}

TrezorDevice.prototype._raw_receive = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    chrome.hid.receive(self.connectionId, function(reportId, data) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        self.reportId = reportId;
        resolve({id: reportId, data: data});
      }
    });
  });
}

TrezorDevice.prototype._receiveMoreOfMessageBody = function(messageBuffer, messageSize) {
  var self = this;
  return new Promise(function(resolve, reject) {
    if (messageBuffer.offset >= messageSize) {
      resolve(messageBuffer);
    } else {
      self._raw_receive().then(function(report) {
        if (report == null || report.data == null) {
          reject("received no data from device");
        } else {
          messageBuffer.append(report.data);
          self._receiveMoreOfMessageBody(messageBuffer,
                                   messageSize).then(function(message) {
                                     resolve(message);
                                   });
        }
      });
    }
  });
}

TrezorDevice.prototype.parseHeadersAndCreateByteBuffer = function(first_msg) {
  var msg = ByteBuffer.concat([first_msg]);
  var original_length = msg.limit;

  var sharp1 = msg.readByte();
  var sharp2 = msg.readByte();
  if (sharp1 != 0x23 || sharp2 != 0x23) {
    console.error("Didn't receive expected header signature.");
    return null;
  }
  var messageType = msg.readUint16();
  var messageLength = msg.readUint32();
  var messageBuffer = new ByteBuffer(messageLength);
  messageBuffer.append(msg);

  return [messageType, messageLength, messageBuffer];
}

TrezorDevice.prototype.receive = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self._raw_receive().then(function(report) {
      var headers = self.parseHeadersAndCreateByteBuffer(report.data);
      if (headers == null) {
        reject("Failed to parse headers.");
      } else {
        self._receiveMoreOfMessageBody(headers[2], headers[1])
          .then(function(byteBuffer) {
            byteBuffer.reset();
            resolve(new Message(headers[0], byteBuffer.toArrayBuffer()));
          });
      }
    });
  });
}

TrezorDevice.prototype.send = function(msg_name, data) {
  var msg;
  if(data) {
      msg = new Messages[msg_name](data);
  } else {
      msg = new Messages[msg_name]();
  }
  var msg_type = Messages.MessageType['MessageType_' + msg_name];

  var msg_ab = new Uint8Array(msg.encodeAB());
  var header_size = 1 + 1 + 4 + 2;
  var full_size = header_size + msg_ab.length;
  var msg_full = new ByteBuffer(header_size + full_size);
  msg_full.writeByte(0x23);
  msg_full.writeByte(0x23);
  msg_full.writeUint16(msg_type);
  msg_full.writeUint32(msg_ab.length);
  msg_full.append(msg_ab);
  var arrayBuffer = new Uint8Array(msg_full.buffer);

  var self = this;
  return new Promise(function(resolve, reject) {
    var data = self._padByteArray(arrayBuffer, 63);
    chrome.hid.send(self.connectionId, self.reportId, data.buffer, function() {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(self.receive());
      }
    });
  });

}

module.exports = TrezorDevice;
