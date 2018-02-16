/*
Simply find and replace instances below with the coin and symbol you want to use!
search and replace with case sensitivity!!
example:
1. lightcoin  = ethereum
2. Litecoin   = Ethereum
3. ltc        = eth
4. LTC        = ETH
*/

/*
'use strict';

const bitcoin = require('bitcoin'); //leave as const bitcoin = require('bitcoin');
let Regex = require('regex'),
config = require('config'),
spamchannel = config.get('moderation').botspamchannel;
config = config.get('litecoind');
const litecoin = new bitcoin.Client(config);  //leave as = new bitcoin.Client(config)

exports.commands = [
  "tipltc",
  "multitipltc",
  "roletipltc"
]
exports.tipltc = {
  usage: "<subcommand>",
  description: '**!tipltc** : Displays This Message\n    **!tipltc balance** : get your balance\n    **!tipltc deposit** : get address for your deposits\n    **!tipltc withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tipltc <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tipltc private <user> <amount>** : put private before Mentioning a user to tip them privately.',
  process: async function (bot, msg, suffix) {
    let tipper = msg.author.id.replace('!', ''),
      words = msg.content.trim().split(' ').filter(function (n) { return n !== ""; }),
      subcommand = words.length >= 2 ? words[1] : 'help',
      helpmsg = '**!tipltc** : Displays This Message\n    **!tipltc balance** : get your balance\n    **!tipltc deposit** : get address for your deposits\n    **!tipltc withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tipltc <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tipltc private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n**!multitipltc** : Displays This Message Below\n' +
      '    **!multitipltc <@user1> <@user2> <amount>** : Mention one or more users, seperated by spaces, then an amount that each mentioned user will receive.\n    **!multitipltc private <@user1> <@user2> <amount>** : Put private before Mentioning one or more users to have each user tipped privately.\n\n**!roletipltc** : Displays This Message Below\n    **!roletipltc <@role> <amount>** : Mention a single role, then an amount that each user in that role will receive.\n    **!roletipltc private <@role> <amount>** : Put private before the role to have each user tipped privately.\n    **<> : Replace with appropriate value.**',
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

exports.multitipltc = {
  usage: "<subcommand>",
  description: "**!multitipltc** : Displays This Message\n    **!multitipltc <@user1> <@user2> <amount>** : Mention one or more users, seperated by spaces, then an amount that each mentioned user will receive.\n    **!multitipltc private <@user1> <@user2> <amount>** : Put private before Mentioning one or more users to have each user tipped privately.\n    ** <> : Replace with appropriate value.**",
  process: async function (bot, msg, suffix) {
    let tipper = msg.author.id.replace('!', ''),
        words = msg.content.trim().split(' ').filter(function (n) { return n !== ""; }),
        subcommand = words.length >= 2 ? words[1] : 'help',
        helpmsg = '**!multitipltc** : Displays This Message\n    **!multitipltc <@user1> <@user2> <amount>** : Mention one or more users, seperated by spaces, then an amount that each mentioned user will receive.\n    **!multitipltc private <@user1> <@user2> <amount>** : Put private before Mentioning one or more users to have each user tipped privately.\n    ** <> : Replace with appropriate value.**',
        channelwarning = 'Please use <#'+ spamchannel + '> or DMs to talk to bots.';
    switch(subcommand) {
      case 'help': privateOrBotSpamOnly(msg, channelwarning, doHelp, [helpmsg]); break;
      default: doMultiTip(msg, tipper, words, helpmsg); break;
    }
  }
}


exports.roletipltc = {
  usage: "<subcommand>",
  description: "**!roletipltc** : Displays This Message\n    **!roletipltc <@role> <amount>** : Mention a single role, then an amount that each user in that role will receive.\n    **!roletipltc private <@role> <amount>** : Put private before the role to have each user tipped privately.\n    ** <> : Replace with appropriate value.**",
  process: async function (bot, msg, suffix) {
    let tipper = msg.author.id.replace('!', ''),
        words = msg.content.trim().split(' ').filter(function (n) { return n !== ""; }),
        subcommand = words.length >= 2 ? words[1] : 'help',
        helpmsg = '**!roletipltc** : Displays This Message\n    **!roletipltc <@role> <amount>** : Mention a single role, then an amount that each user in that role will receive.\n    **!roletipltc private <@role> <amount>** : Put private before the role to have each user tipped privately.\n    ** <> : Replace with appropriate value.**',
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
  litecoin.getBalance(tipper, 1, function (err, balance) {
    if (err) {
      message.reply('Error getting Litecoin balance.').then(message => message.delete(5000));
    }
    else {
      message.reply('You have *' + balance + '* LTC');
    }
  });
}


function doDeposit(message, tipper) {
  getAddress(tipper, function (err, address) {
    if (err) {
      message.reply('Error getting your Litecoin deposit address.').then(message => message.delete(5000));
    }
    else {
      message.reply('Your Litecoin (LTC) address is ' + address);
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
    message.reply('I dont know how to withdraw that many Litecoin coins...').then(message => message.delete(5000));
    return;
  }

  litecoin.sendFrom(tipper, address, amount, function (err, txId) {
    if (err) {
      message.reply(err.message).then(message => message.delete(5000));
    }
    else {
      message.reply('You withdrew ' + amount + ' LTC to ' + address + '\n' + txLink(txId) + '\n');
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
    message.reply('I dont know how to tip that many Litecoin coins...').then(message => message.delete(5000));
    return;
  }

  if (message.mentions.users.first().id) {
    sendLTC(message, tipper, message.mentions.users.first().id.replace('!', ''), amount, prv);
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
    message.reply('I don\'t know how to tip that many Litecoin coins...').then(message => message.delete(5000));
    return;
  }
  if (!userIDs) {
    message.reply('Sorry, I could not find a user in your tip...').then(message => message.delete(5000));
    return;
  }
  for (var i = 0; i < userIDs.length; i++) {
    sendLTC(message, tipper, userIDs[i].toString(), amount, prv);
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
    message.reply('I don\'t know how to tip that many Litecoin coins...').then(message => message.delete(5000));
    return;
  }
  if (message.mentions.roles.first().id) {
    if (message.mentions.roles.first().members.first().id) {
      let userIDs = message.mentions.roles.first().members.map(member => member.user.id.replace('!', ''));
      for (var i = 0; i < userIDs.length; i++) {
        sendLTC(message, tipper, userIDs[i], amount, prv);
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


function sendLTC(message, tipper, recipient, amount, privacyFlag) {
  getAddress(recipient.toString(), function (err, address) {
    if (err) {
      message.reply(err.message).then(message => message.delete(5000));
    }
    else {
      litecoin.sendFrom(tipper, address, amount, 1, null, null, function (err, txId) {
        if (err) {
          message.reply(err.message).then(message => message.delete(5000));
        }
        else {
          if (privacyFlag) {
            var imessage =
              ' You privately tipped ' + message.mentions.users.first().username + ' ' + amount + ' LTC\n' + txLink(txId) + '\n' +
              'DM me `!tipltc` for ltcTIpper instructions.'
            if (message.content.startsWith("!tipltc private ") || message.content.startsWith("!multitipltc private ") || message.content.startsWith("!roletipltc private ")) {
               message.delete(1000); //Supposed to delete message
            }
            message.author.send(imessage);
            if (message.author.id != message.mentions.users.first().id) {
              var iimessage =
                ' You got privately tipped ' + amount + ' LTC\n' + txLink(txId) + '\n' +
                'DM me `!tipltc` for ltcTIpper instructions.'
              message.mentions.users.first().send(iimessage);
            }
          } else {
            var iiimessage =
              ' tipped <@' + recipient + '> ' + amount + ' LTC\n' + txLink(txId) + '\n' +
              'DM me `!tipltc` for ltcTIpper instructions.'
            message.reply(iiimessage);
          }
        }
      });
    }
  });
};


function getAddress(userId, cb) {
  litecoin.getAddressesByAccount(userId, function (err, addresses) {
    if (err) {
      cb(err);
    }
    else if (addresses.length > 0) {
      cb(null, addresses[0]);
    }
    else {
      litecoin.getNewAddress(userId, function (err, address) {
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
  if (amount.toLowerCase().endsWith('ltc')) {
    amount = amount.substring(0, amount.length - 3);
  }
  return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
}


function txLink(txId) {
  return "http://Explorer-Url/tx/" + txId;
}

*/
