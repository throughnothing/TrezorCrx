# TrezorCrx

Chrome App to interface with Trezor Hardware wallet.  My goal is to make
this usable on a chromebook.

## Status

TrezorCrx currently isn't very usable.  It can connect to the trezor and
display your addresses (at `m/44'/0'/0'/0/x`, just like mytrezor.com).
Passphrase support is in progress.

## Running in Chrome

To run the app, you *do not* need to install the developer requirements
listed below if you don't want to modify the code.

Simply enable "Developer mode" checkbox in the upper-right-hand corner of
`chrome://extensions` and then click "Load unpacked extension..." and pick
the root directory of this repo.

The `manifest.json`, along with the `background.js` file that it points to
will tell chrome how to run everything.

If you want to modify the code and run your modifications, you will need to
proceed with the development requirements below.

## Development requirements

  * Chrome 38 or later. If you're on dev channel you should be fine.
  * Node.js's [npm](https://www.npmjs.org/). On my OSX machine I
    satisfied this requirement with `brew install node`.
  * Webpack + App dependencies:
    * `sudo npm -g install webpack && sudo npm install`

## Build

To build run `webpack`.  Whenever you make changes to the javascript in `js/`
you will need to run webpack before re-launching the app from Chrome.

## TODO

  * ~~Move to webpack~~
  * ~~Get rid of old Makefile/buIld stuff~~
  * ~~Restructure directories~~
  * ReactJS
  * react-router-component (https://github.com/STRML/react-router-component)
  * Use cx() for css ClassName manipulation
  * decide API to use for address checking (Chain, blockchain.info, Coinbase)
    * (or do SPV node like: https://github.com/ryanxcharles/fullnode?!)
  * Make it look pretty (:-O)
  * Will we need to use localstorage for anything?
  * Make Chrome 39+ required to get HID onDevice\* notification events?
    * https://developer.chrome.com/apps/hid
  * Ability to detect bitcoin addresses and Autotip metatags on web pages and
    Prompt for trezor/payment if desired?
