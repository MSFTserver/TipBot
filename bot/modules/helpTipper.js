'use strict';
exports.commands = ['tiphelp'];
exports.tiphelp = {
  usage: '<subcommand>',
  description: 'This commands has been changed to currency specific commands!',
  process: function(bot, message) {
    message.author.send(
      '**Ravencoin Tipper(RVN)**\n    **!tiprvn balance** : get your balance\n    **!tiprvn deposit** : get address for your deposits\n    **!tiprvn withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tiprvn <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tiprvn private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n    **!multitiprvn** : Displays This Message Below\n' +
        '    **!multitiprvn <@user1> <@user2> <amount>** : Mention one or more users, seperated by spaces, then an amount that each mentioned user will receive.\n    **!multitiprvn private <@user1> <@user2> <amount>** : Put private before Mentioning one or more users to have each user tipped privately.\n\n    **!roletiprvn** : Displays This Message Below\n    **!roletiprvn <@role> <amount>** : Mention a single role, then an amount that each user in that role will receive.\n    **!roletiprvn private <@role> <amount>** : Put private before the role to have each user tipped privately.\n\n'
    );
    message.author.send(
      '**Dogecoin(DOGE) Tipper**\n    **!tipdoge balance** : get your balance\n    **!tipdoge deposit** : get address for your deposits\n    **!tipdoge withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tipdoge <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tipdoge private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n    **!multitipdoge** : Displays This Message Below\n' +
        '    **!multitipdoge <@user1> <@user2> <amount>** : Mention one or more users, seperated by spaces, then an amount that each mentioned user will receive.\n    **!multitipdoge private <@user1> <@user2> <amount>** : Put private before Mentioning one or more users to have each user tipped privately.\n\n    **!roletipdoge** : Displays This Message Below\n    **!roletipdoge <@role> <amount>** : Mention a single role, then an amount that each user in that role will receive.\n    **!roletipdoge private <@role> <amount>** : Put private before the role to have each user tipped privately.\n    **<> : Replace with appropriate value.**'
    );
    message.author.send(
      '**Lbry Credit(LBC) Tipper**\n    **!tiplbc balance** : get your balance\n    **!tiplbc deposit** : get address for your deposits\n    **!tiplbc withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tiplbc <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tiplbc private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n**!multitiplbc** : Displays This Message Below\n' +
        '    **!multitiplbc <@user1> <@user2> <amount>** : Mention one or more users, seperated by spaces, then an amount that each mentioned user will receive.\n    **!multitiplbc private <@user1> <@user2> <amount>** : Put private before Mentioning one or more users to have each user tipped privately.\n\n**!roletiplbc** : Displays This Message Below\n    **!roletiplbc <@role> <amount>** : Mention a single role, then an amount that each user in that role will receive.\n    **!roletiplbc private <@role> <amount>** : Put private before the role to have each user tipped privately.\n    **<> : Replace with appropriate value.**'
    );
  }
};
