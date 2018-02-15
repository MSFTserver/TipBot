/*
Simply find and replace instances below with the coin and symbol you want to use!
search and replace with case sensitivity!!
example:
1. bitcoin  = lightcoin
2. Bitcoin  = Lightcoin
3. btc      = ltc
4. BTC      = LTC
*/

/*
'use strict';

const bitcoin = require('bitcoin');
let Regex = require('regex'),
config = require('config'),
spamchannel = config.get('moderation').botspamchannel;
config = config.get('bitcoind');
const bitcoin = new bitcoin.Client(config);

exports.commands = [
  "tipbtc",
  "multitipbtc",
  "roletipbtc"
]
exports.tipbtc = {
  usage: "<subcommand>",
  description: '**!tipbtc** : Displays This Message\n    **!tipbtc balance** : get your balance\n    **!tipbtc deposit** : get address for your deposits\n    **!tipbtc withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tipbtc <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tipbtc private <user> <amount>** : put private before Mentioning a user to tip them privately.',
  process: async function (bot, msg, suffix) {
    let tipper = msg.author.id.replace('!', ''),
      words = msg.content.trim().split(' ').filter(function (n) { return n !== ""; }),
      subcommand = words.length >= 2 ? words[1] : 'help',
      helpmsg = '**!tipbtc** : Displays This Message\n    **!tipbtc balance** : get your balance\n    **!tipbtc deposit** : get address for your deposits\n    **!tipbtc withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tipbtc <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tipbtc private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n**!multitipbtc** : Displays This Message Below\n' +
      '    **!multitipbtc <@user1> <@user2> <amount>** : Mention one or more users, seperated by spaces, then an amount that each mentioned user will receive.\n    **!multitipbtc private <@user1> <@user2> <amount>** : Put private before Mentioning one or more users to have each user tipped privately.\n\n**!roletipbtc** : Displays This Message Below\n    **!roletipbtc <@role> <amount>** : Mention a single role, then an amount that each user in that role will receive.\n    **!roletipbtc private <@role> <amount>** : Put private before the role to have each user tipped privately.\n    **<> : Replace with appropriate value.**',
      channelwarning = 'Please use <#'+ spamchannel + '> or DMs to talk to bots.';
    switch (subcommand) {
      case 'help': privateOrBotSpamOnly(msg, channelwarning, doHelp, [helpmsg]); break;
      case 'balance': doBalance(msg, tipper); break;
      case 'deposit': privateOrBotSpamOnly(msg, channelwarning, doDeposit, [tipper]); break;
      case 'withdraw': privateOrBotSpamOnly(msg, channelwarning, doWithdraw, [tipper, words, helpmsg]); break;
      default: doTip(msg, tipper, words, helpmsg);
    }
  }
}

exports.multitipbtc = {
  usage: "<subcommand>",
  description: "**!multitipbtc** : Displays This Message\n    **!multitipbtc <@user1> <@user2> <amount>** : Mention one or more users, seperated by spaces, then an amount that each mentioned user will receive.\n    **!multitipbtc private <@user1> <@user2> <amount>** : Put private before Mentioning one or more users to have each user tipped privately.\n    ** <> : Replace with appropriate value.**",
  process: async function (bot, msg, suffix) {
    let tipper = msg.author.id.replace('!', ''),
        words = msg.content.trim().split(' ').filter(function (n) { return n !== ""; }),
        subcommand = words.length >= 2 ? words[1] : 'help',
        helpmsg = '**!multitipbtc** : Displays This Message\n    **!multitipbtc <@user1> <@user2> <amount>** : Mention one or more users, seperated by spaces, then an amount that each mentioned user will receive.\n    **!multitipbtc private <@user1> <@user2> <amount>** : Put private before Mentioning one or more users to have each user tipped privately.\n    ** <> : Replace with appropriate value.**',
        channelwarning = 'Please use <#'+ spamchannel + '> or DMs to talk to bots.';
    switch(subcommand) {
      case 'help': privateOrBotSpamOnly(msg, channelwarning, doHelp, [helpmsg]); break;
      default: doMultiTip(msg, tipper, words, helpmsg); break;
    }
  }
}


exports.roletipbtc = {
  usage: "<subcommand>",
  description: "**!roletipbtc** : Displays This Message\n    **!roletipbtc <@role> <amount>** : Mention a single role, then an amount that each user in that role will receive.\n    **!roletipbtc private <@role> <amount>** : Put private before the role to have each user tipped privately.\n    ** <> : Replace with appropriate value.**",
  process: async function (bot, msg, suffix) {
    let tipper = msg.author.id.replace('!', ''),
        words = msg.content.trim().split(' ').filter(function (n) { return n !== ""; }),
        subcommand = words.length >= 2 ? words[1] : 'help',
        helpmsg = '**!roletipbtc** : Displays This Message\n    **!roletipbtc <@role> <amount>** : Mention a single role, then an amount that each user in that role will receive.\n    **!roletipbtc private <@role> <amount>** : Put private before the role to have each user tipped privately.\n    ** <> : Replace with appropriate value.**',
        channelwarning = 'Please use <#'+ spamchannel + '> or DMs to talk to bots.';
    switch(subcommand) {
      case 'help': privateOrBotSpamOnly(msg, channelwarning, doHelp, [helpmsg]); break;
      default: doRoleTip(msg, tipper, words, helpmsg); break;
    }
  }
}


function privateOrBotSpamOnly(message, wrongchannelmsg, fn, args) {
  if (!inPrivateOrBotSpam(message)) {
    message.reply(wrongchannelmsg);
    return;
  }
  fn.apply(null, [message, ...args]);
}


function doHelp(message, helpmsg) {
  message.author.send(helpmsg);
}


function doBalance(message, tipper) {
  bitcoin.getBalance(tipper, 1, function (err, balance) {
    if (err) {
      message.reply('Error getting Bitcoin balance.').then(message => message.delete(5000));
    }
    else {
      message.reply('You have *' + balance + '* BTC');
    }
  });
}


function doDeposit(message, tipper) {
  getAddress(tipper, function (err, address) {
    if (err) {
      message.reply('Error getting your Bitcoin deposit address.').then(message => message.delete(5000));
    }
    else {
      message.reply('Your Bitcoin (BTC) address is ' + address);
    }
  });
}


function doWithdraw(message, tipper, words, helpmsg) {
  if (words.length < 4) {
    doHelp(message, helpmsg);
    return;
  }

  var address = words[2],
      amount = getValidatedAmount(words[3]);

  if (amount === null) {
    message.reply('I dont know how to withdraw that many Bitcoin coins...').then(message => message.delete(5000));
    return;
  }

  bitcoin.sendFrom(tipper, address, amount, function (err, txId) {
    if (err) {
      message.reply(err.message).then(message => message.delete(5000));
    }
    else {
      message.reply('You withdrew ' + amount + ' BTC to ' + address + '\n' + txLink(txId) + '\n');
    }
  });
}


function doTip(message, tipper, words, helpmsg) {
  if (words.length < 3 || !words) {
    doHelp(message, helpmsg);
    return;
  }

  var prv = false;
  var amountOffset = 2;
  if (words.length >= 4 && words[1] === 'private') {
    prv = true;
    amountOffset = 3;
  }

  let amount = getValidatedAmount(words[amountOffset]);

  if (amount === null) {
    message.reply('I dont know how to tip that many Bitcoin coins...').then(message => message.delete(5000));
    return;
  }

  if (message.mentions.users.first().id) {
    sendBTC(message, tipper, message.mentions.users.first().id.replace('!', ''), amount, prv);
  }
  else {
    message.reply('Sorry, I could not find a user in your tip...').then(message => message.delete(5000));
  }
}


function doMultiTip(message, tipper, words, helpmsg) {
  if (!words) {
    doHelp(message, helpmsg);
    return;
  }
  if (words.length < 4) {
    doTip(message, tipper, words, helpmsg);
    return;
  }
  var prv = false;
  if (words.length >= 5 && words[1] === 'private') {
    prv = true;
  }
  let [userIDs, amount] = findUserIDsAndAmount(message, words, prv);
  if (amount == null) {
    message.reply('I don\'t know how to tip that many Bitcoin coins...').then(message => message.delete(5000));
    return;
  }
  if (!userIDs) {
    message.reply('Sorry, I could not find a user in your tip...').then(message => message.delete(5000));
    return;
  }
  for (var i = 0; i < userIDs.length; i++) {
    sendBTC(message, tipper, userIDs[i].toString(), amount, prv);
  }
}


function doRoleTip(message, tipper, words, helpmsg) {
  if (!words || words.length < 3) {
    doHelp(message, helpmsg);
    return;
  }
  var prv = false;
  var amountOffset = 2;
  if (words.length >= 4 && words[1] === 'private') {
    prv = true;
    amountOffset = 3;
  }
  let amount = getValidatedAmount(words[amountOffset]);
  if (amount == null) {
    message.reply('I don\'t know how to tip that many Bitcoin coins...').then(message => message.delete(5000));
    return;
  }
  if (message.mentions.roles.first().id) {
    if (message.mentions.roles.first().members.first().id) {
      let userIDs = message.mentions.roles.first().members.map(member => member.user.id.replace('!', ''));
      for (var i = 0; i < userIDs.length; i++) {
        sendBTC(message, tipper, userIDs[i], amount, prv);
      }
    }
    else {
      message.reply('Sorry, I could not find any users to tip in that role...').then(message => message.delete(5000));
      return;
    }
  }
  else {
    message.reply('Sorry, I could not find any roles in your tip...').then(message => message.delete(5000));
    return;
  }
}


function findUserIDsAndAmount(message, words, prv) {
  var idList = [];
  var amount = null;
  var count = 0;
  var startOffset = 1;
  if (prv) startOffset = 2;
  var regex = new RegExp(/<@!?[0-9]+>/)
  for (var i = startOffset; i < words.length; i++) {
    if (regex.test(words[i])) {
      count++;
      idList.push(words[i].match(/[0-9]+/));
    } else {
      amount = getValidatedAmount(words[Number(count)+1]);
      if (amount == null) break;
      break
    }
  }
  return [idList, amount];
}


function sendBTC(message, tipper, recipient, amount, privacyFlag) {
  getAddress(recipient.toString(), function (err, address) {
    if (err) {
      message.reply(err.message).then(message => message.delete(5000));
    }
    else {
      bitcoin.sendFrom(tipper, address, amount, 1, null, null, function (err, txId) {
        if (err) {
          message.reply(err.message).then(message => message.delete(5000));
        }
        else {
          if (privacyFlag) {
            var imessage =
              ' You privately tipped ' + message.mentions.users.first().username + ' ' + amount + ' BTC\n' + txLink(txId) + '\n' +
              'DM me `!tipbtc` for btcTIpper instructions.'
            if (message.content.startsWith("!tipbtc private ") || message.content.startsWith("!multitipbtc private ") || message.content.startsWith("!roletipbtc private ")) {
               message.delete(1000); //Supposed to delete message
            }
            message.author.send(imessage);
            if (message.author.id != message.mentions.users.first().id) {
              var iimessage =
                ' You got privately tipped ' + amount + ' BTC\n' + txLink(txId) + '\n' +
                'DM me `!tipbtc` for btcTIpper instructions.'
              message.mentions.users.first().send(iimessage);
            }
          } else {
            var iiimessage =
              ' tipped <@' + recipient + '> ' + amount + ' BTC\n' + txLink(txId) + '\n' +
              'DM me `!tipbtc` for btcTIpper instructions.'
            message.reply(iiimessage);
          }
        }
      });
    }
  });
};


function getAddress(userId, cb) {
  bitcoin.getAddressesByAccount(userId, function (err, addresses) {
    if (err) {
      cb(err);
    }
    else if (addresses.length > 0) {
      cb(null, addresses[0]);
    }
    else {
      bitcoin.getNewAddress(userId, function (err, address) {
        if (err) {
          cb(err);
        }
        else {
          cb(null, address);
        }
      });
    }
  });
}


function inPrivateOrBotSpam(msg) {
  if ((msg.channel.type == 'dm') || (msg.channel.id === spamchannel)) {
    return true;
  } else {
    return false;
  }
}


function getValidatedAmount(amount) {
  amount = amount.trim();
  if (amount.toLowerCase().endsWith('btc')) {
    amount = amount.substring(0, amount.length - 3);
  }
  return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
}


function txLink(txId) {
  return "http://Explorer-Url/tx/" + txId;
}

*/
