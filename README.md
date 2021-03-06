# TrezorCrx

**UPDATE**: This repo is now unmaintained.  I've moved the main parts
to my [chrome-trezor](https://github.com/throughnothing/chrome-trezor)
repo in a more modularized fashion that can be used in chrome apps.
Please use that repository instead, as this one won't be maintained.

Chrome App to interface with Trezor Hardware wallet.  My goal is to make
this usable on a chromebook.

## Status

TrezorCrx currently isn't very usable and is **alpha quality software**.
Please don't do anything with real bitcoins or real wallets with it, yet.
Use at your own risk!

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

To build run: `npm run build`

Whenever you make changes to the javascript in `js/` you will need to run
this again before re-launching the app from Chrome.
