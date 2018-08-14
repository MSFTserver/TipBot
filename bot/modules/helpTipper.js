'use strict';
let config = require('config');
let ravenFee = config.get('rvn').paytxfee;
let dogeFee = config.get('doge').paytxfee;
let lbryFee = config.get('lbc').paytxfee;
let phaseFee = config.get('phase').paytxfee;
let ufoFee = config.get('ufo').paytxfee;
let phoenixFee = config.get('pxc').paytxfee;
let featherFee = config.get('ftc').paytxfee;
let verticalFee = config.get('vtl').paytxfee;
exports.commands = ['tiphelp'];
exports.tiphelp = {
  usage: '<subcommand>',
  description: 'This commands has been changed to currency specific commands!',
  process: function(bot, message) {
    message.author.send(
      '__**:bank: Coins :bank:**__\n' +
      '  **Ravencoin (RVN) Tipper**\n    Transaction Fees: **' + ravenFee + '**\n' +
      '  **Dogecoin (DOGE) Tipper**\n    Transaction Fees: **' + dogeFee + '**\n' +
      '  **LBRY Credit (LBC) Tipper**\n    Transaction Fees: **' + lbryFee + '**\n' +
      '  **Phase (PHASE) Tipper**\n    Transaction Fees: **' + phaseFee + '**\n' +
      '  **Uniform Fiscal Object (UFO) Tipper**\n    Transaction Fees: **' + ufoFee + '**\n' +
      '  **Phoenixcoin (PXC) Tipper**\n    Transaction Fees: **' + phoenixFee + '**\n' +
      '  **Feathercoin (FTC) Tipper**\n    Transaction Fees: **' + featherFee + '**\n' +
      '  **Vertical (VTL) Tipper**\n    Transaction Fees: **' + verticalFee + '**\n' +
      '__**Commands**__\n' +
      '  **!tip<CoinSymbol>** : Displays This Message\n' +
      '  **!tip<CoinSymbol> balance** : get your balance\n' +
      '  **!tip<CoinSymbol> deposit** : get address for your deposits\n' +
      '  **!tip<CoinSymbol> withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n' +
      '  **!tip<CoinSymbol> <@user> <amount>** :mention a user with @ and then the amount to tip them\n' +
      '  **!tip<CoinSymbol> private <user> <amount>** : put private before Mentioning a user to tip them privately'
      '**<> : Replace carrot <> symbole with appropriate value.**'
      '__**Examples**__\n' +
      '  **!tiprvn @MSFTserver 10**\n' +
      '  **!tipdoge withdraw DOGEaddressHERE 10**\n' +
      '  **!tipftc private @MSFTserver 10**\n' +
      '  **!tiplbc balance**\n' +
      '  **!tippxc deposit**\n'
    );
  }
};
