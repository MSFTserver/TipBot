'use strict';

const bitcoin = require('bitcoin');

let Regex = require('regex'),
  config = require('config'),
  spamchannels = config.get('moderation').botspamchannels;
let walletConfig = config.get('ftcd');
const ftc = new bitcoin.Client(walletConfig);

exports.commands = ['tipftc'];
exports.tipftc = {
  usage: '<subcommand>',
  description:
    '**!tipftc** : Displays This Message\n    **!tipftc balance** : get your balance\n    **!tipftc deposit** : get address for your deposits\n    **!tipftc withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tipftc <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tipftc private <user> <amount>** : put private before Mentioning a user to tip them privately.',
  process: async function(bot, msg, suffix) {
    let tipper = msg.author.id.replace('!', ''),
      words = msg.content
        .trim()
        .split(' ')
        .filter(function(n) {
          return n !== '';
        }),
      subcommand = words.length >= 2 ? words[1] : 'help',
      helpmsg =
        '**!tipftc** : Displays This Message\n    **!tipftc balance** : get your balance\n    **!tipftc deposit** : get address for your deposits\n    **!tipftc withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tipftc <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tipftc private <user> <amount>** : put private before Mentioning a user to tip them privately.\n    **<> : Replace with appropriate value.**',
      channelwarning = 'Please use <#bot-spam> or DMs to talk to bots.';
    switch (subcommand) {
      case 'help':
        privateorSpamChannel(msg, channelwarning, doHelp, [helpmsg]);
        break;
      case 'balance':
        doBalance(msg, tipper);
        break;
      case 'deposit':
        privateorSpamChannel(msg, channelwarning, doDeposit, [tipper]);
        break;
      case 'withdraw':
        privateorSpamChannel(msg, channelwarning, doWithdraw, [tipper, words, helpmsg]);
        break;
      default:
        doTip(bot, msg, tipper, words, helpmsg);
    }
  }
};

function privateorSpamChannel(message, wrongchannelmsg, fn, args) {
  if (!inPrivateorSpamChannel(message)) {
    message.reply(wrongchannelmsg);
    return;
  }
  fn.apply(null, [message, ...args]);
}

function doHelp(message, helpmsg) {
  message.author.send(helpmsg);
}

function doBalance(message, tipper) {
  ftc.getBalance(tipper, 1, function(err, balance) {
    if (err) {
      message.reply('Error getting Feathercoin (FTC) balance.').then(message => message.delete(10000));
    } else {
      message.reply('You have **' + balance + '** Feathercoin (FTC)');
    }
  });
}

function doDeposit(message, tipper) {
  getAddress(tipper, function(err, address) {
    if (err) {
      message.reply('Error getting your Feathercoin (FTC) deposit address.').then(message => message.delete(10000));
    } else {
      message.reply('Your Feathercoin (FTC) address is ' + address);
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
    message.reply("I don't know how to withdraw that much Feathercoin (FTC)...").then(message => message.delete(10000));
    return;
  }

  ftc.sendFrom(tipper, address, Number(amount), function(err, txId) {
    if (err) {
      message.reply(err.message).then(message => message.delete(10000));
    } else {
      message.reply('You withdrew ' + amount + ' Feathercoin (FTC) coins to ' + address + '\n' + txLink(txId) + '\n');
    }
  });
}

function doTip(bot, message, tipper, words, helpmsg) {
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
    message.reply("I don't know how to tip that much Feathercoin (FTC)...").then(message => message.delete(10000));
    return;
  }
  if (!message.mentions.users.first()){
       message
        .reply('Sorry, I could not find a user in your tip...')
        .then(message => message.delete(10000));
        return;
      }
  if (message.mentions.users.first().id) {
    sendFTC(bot, message, tipper, message.mentions.users.first().id.replace('!', ''), amount, prv);
  } else {
    message.reply('Sorry, I could not find a user in your tip...').then(message => message.delete(10000));
  }
}

function sendFTC(bot, message, tipper, recipient, amount, privacyFlag) {
  getAddress(recipient.toString(), function(err, address) {
    if (err) {
      message.reply(err.message).then(message => message.delete(10000));
    } else {
      ftc.sendFrom(tipper, address, Number(amount), 1, null, null, function(err, txId) {
        if (err) {
          message.reply(err.message).then(message => message.delete(10000));
        } else {
          if (privacyFlag) {
            let userProfile = message.guild.members.find('id', recipient);
            var iimessage =
              ' You got privately tipped ' +
              amount +
              ' Feathercoin (FTC)\n' +
              txLink(txId) +
              '\n' +
              'DM me `!tipftc` for ftcTipper instructions.';
            userProfile.user.send(iimessage);
            var imessage =
              ' You privately tipped ' +
              userProfile.user.username +
              ' ' +
              amount +
              ' Feathercoin (FTC)\n' +
              txLink(txId) +
              '\n' +
              'DM me `!tipftc` for ftcTipper instructions.';
            message.author.send(imessage);

            if (
              message.content.startsWith('!tipftc private ')
            ) {
              message.delete(1000); //Supposed to delete message
            }
          } else {
            var iiimessage =
              ' tipped <@' +
              recipient +
              '> ' +
              amount +
              ' Feathercoin (FTC)\n' +
              txLink(txId) +
              '\n' +
              'DM me `!tipftc` for ftcTipper instructions.';
              message.reply(iiimessage);
          }
        }
      });
    }
  });
}

function getAddress(userId, cb) {
  ftc.getAddressesByAccount(userId, function(err, addresses) {
    if (err) {
      cb(err);
    } else if (addresses.length > 0) {
      cb(null, addresses[0]);
    } else {
      ftc.getNewAddress(userId, function(err, address) {
        if (err) {
          cb(err);
        } else {
          cb(null, address);
        }
      });
    }
  });
}

function inPrivateorSpamChannel(msg) {
  if (msg.channel.type == 'dm' || isSpam(msg)) {
    return true;
  } else {
    return false;
  }
}

function isSpam(msg) {
  return spamchannels.includes(msg.channel.id);
};


function getValidatedAmount(amount) {
  amount = amount.trim();
  if (amount.toLowerCase().endsWith('ftc')) {
    amount = amount.substring(0, amount.length - 3);
  }
  return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
}

function txLink(txId) {
  return 'https://explorer.feathercoin.com/tx/' + txId;
}
