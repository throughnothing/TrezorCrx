trhid
=====

Proof-of-concept Chrome App for Trezor. Not affiliated with Trezor
manufacturer.

Development requirements
===

  * Chrome 38 or later. If you're on dev channel you should be fine.
  * Some sort of POSIXy system
  * Node.js's [npm](https://www.npmjs.org/). On my OSX machine I
    satisfied this requirement with `brew install node`.
  * `sudo npm -g install webpack && sudo npm install`

Build with `webpack`. 
To test the app, go to "Load unpacked
extension..." in chrome://extensions and then pick the root directory
(with the manifest.json).
