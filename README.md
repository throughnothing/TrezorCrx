# TrezorCrx

Chrome App to interface with Trezor Hardware wallet.  My goal is to make
this usable on a chromebook.

## Status

TrezorCrx currently isn't very usable.  It can connect to the trezor and
display your addresses (at `m/44'/0'/0'/0/x`, just like mytrezor.com).
Passphrase support is in progress.

## Development requirements

  * Chrome 38 or later. If you're on dev channel you should be fine.
  * Node.js's [npm](https://www.npmjs.org/). On my OSX machine I
    satisfied this requirement with `brew install node`.
  * Webpack + App dependencies:
    * `sudo npm -g install webpack && sudo npm install`

## Build

To build run `webpack`.

## Running in Chrome

To run the app, go to "Load unpacked extension..." in chrome://extensions
and then pick the root directory of this repo.  The `manifest.json`, along
with the `background.js` file that it points to will tell chrome how to
run everything.
