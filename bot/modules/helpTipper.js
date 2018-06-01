'use strict';
exports.commands = ['tiphelp'];
exports.tiphelp = {
  usage: '<subcommand>',
  description: 'This commands has been changed to currency specific commands!',
  process: function(bot, message) {
    message.author.send(
      '**Ravencoin(RVN) Tipper**\n    **!tiprvn balance** : get your balance\n    **!tiprvn deposit** : get address for your deposits\n    **!tiprvn withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tiprvn <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tiprvn private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n'
    );
    message.author.send(
      '**Dogecoin(DOGE) Tipper**\n    **!tipdoge balance** : get your balance\n    **!tipdoge deposit** : get address for your deposits\n    **!tipdoge withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tipdoge <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tipdoge private <user> <amount>** : put private before Mentioning a user to tip them privately.'
    );
    message.author.send(
      '**Lbry Credit(LBC) Tipper**\n    **!tiplbc balance** : get your balance\n    **!tiplbc deposit** : get address for your deposits\n    **!tiplbc withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tiplbc <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tiplbc private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n    **<> : Replace with appropriate value.**'
    );
    message.author.send(
      '**Proton(PROTON) Tipper**\n    **!tipproton balance** : get your balance\n    **!tipproton deposit** : get address for your deposits\n    **!tipproton withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tipproton <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tipproton private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n    **<> : Replace with appropriate value.**'
    );
    message.author.send(
      '**Uniform Fiscal Object(UFO) Tipper**\n    **!tipufo balance** : get your balance\n    **!tipufo deposit** : get address for your deposits\n    **!tipufo withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tipufo <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tipufo private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n    **<> : Replace with appropriate value.**'
    );
  }
};
