'use strict';

const bitcoin = require('bitcoin'); //leave as const bitcoin = require('bitcoin');

let Regex = require('regex'),
  config = require('config'),
  spamchannel = config.get('moderation').botspamchannel;
config = config.get('ravend');
const raven = new bitcoin.Client(config); //leave as = new bitcoin.Client(config)

exports.commands = ['tiprvn', 'multitiprvn', 'roletiprvn'];
exports.tiprvn = {
  usage: '<subcommand>',
  description:
    '**!tiprvn** : Displays This Message\n    **!tiprvn balance** : get your balance\n    **!tiprvn deposit** : get address for your deposits\n    **!tiprvn withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tiprvn <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tiprvn private <user> <amount>** : put private before Mentioning a user to tip them privately.',
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
        '**!tiprvn** : Displays This Message\n    **!tiprvn balance** : get your balance\n    **!tiprvn deposit** : get address for your deposits\n    **!tiprvn withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tiprvn <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tiprvn private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n**!multitiprvn** : Displays This Message Below\n' +
        '    **!multitiprvn <@user1> <@user2> <amount>** : Mention one or more users, seperated by spaces, then an amount that each mentioned user will receive.\n    **!multitiprvn private <@user1> <@user2> <amount>** : Put private before Mentioning one or more users to have each user tipped privately.\n\n**!roletiprvn** : Displays This Message Below\n    **!roletiprvn <@role> <amount>** : Mention a single role, then an amount that each user in that role will receive.\n    **!roletiprvn private <@role> <amount>** : Put private before the role to have each user tipped privately.\n    **<> : Replace with appropriate value.**',
      channelwarning =
        'Please use <#' + spamchannel + '> or DMs to talk to bots.',
      MultiorRole = false;
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
        privateorSpamChannel(msg, channelwarning, doWithdraw, [
          tipper,
          words,
          helpmsg
        ]);
        break;
      default:
        doTip(bot, msg, tipper, words, helpmsg, MultiorRole);
    }
  }
};

exports.multitiprvn = {
  usage: '<subcommand>',
  description:
    '**!multitiprvn** : Displays This Message\n    **!multitiprvn <@user1> <@user2> <amount>** : Mention one or more users, seperated by spaces, then an amount that each mentioned user will receive.\n    **!multitiprvn private <@user1> <@user2> <amount>** : Put private before Mentioning one or more users to have each user tipped privately.\n    ** <> : Replace with appropriate value.**',
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
        '**!multitiprvn** : Displays This Message\n    **!multitiprvn <@user1> <@user2> <amount>** : Mention one or more users, seperated by spaces, then an amount that each mentioned user will receive.\n    **!multitiprvn private <@user1> <@user2> <amount>** : Put private before Mentioning one or more users to have each user tipped privately.\n    ** <> : Replace with appropriate value.**',
      channelwarning =
        'Please use <#' + spamchannel + '> or DMs to talk to bots.',
      MultiorRole = true;
    switch (subcommand) {
      case 'help':
        privateorSpamChannel(msg, channelwarning, doHelp, [helpmsg]);
        break;
      default:
        doMultiTip(bot, msg, tipper, words, helpmsg, MultiorRole);
        break;
    }
  }
};

exports.roletiprvn = {
  usage: '<subcommand>',
  description:
    '**!roletiprvn** : Displays This Message\n    **!roletiprvn <@role> <amount>** : Mention a single role, then an amount that each user in that role will receive.\n    **!roletiprvn private <@role> <amount>** : Put private before the role to have each user tipped privately.\n    ** <> : Replace with appropriate value.**',
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
        '**!roletiprvn** : Displays This Message\n    **!roletiprvn <@role> <amount>** : Mention a single role, then an amount that each user in that role will receive.\n    **!roletiprvn private <@role> <amount>** : Put private before the role to have each user tipped privately.\n    ** <> : Replace with appropriate value.**',
      channelwarning =
        'Please use <#' + spamchannel + '> or DMs to talk to bots.',
      MultiorRole = true;
    switch (subcommand) {
      case 'help':
        privateorSpamChannel(msg, channelwarning, doHelp, [helpmsg]);
        break;
      default:
        doRoleTip(bot, msg, tipper, words, helpmsg, MultiorRole);
        break;
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
  raven.getBalance(tipper, 1, function(err, balance) {
    if (err) {
      message
        .reply('Error getting Raven balance.')
        .then(message => message.delete(10000));
    } else {
      message.reply('You have *' + balance + '* RVN');
    }
  });
}

function doDeposit(message, tipper) {
  getAddress(tipper, function(err, address) {
    if (err) {
      message
        .reply('Error getting your Raven deposit address.')
        .then(message => message.delete(10000));
    } else {
      message.reply('Your Raven (RVN) address is ' + address);
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
    message
      .reply("I don't know how to withdraw that many Raven coins...")
      .then(message => message.delete(10000));
    return;
  }

  raven.sendFrom(tipper, address, Number(amount), function(err, txId) {
    if (err) {
      message.reply(err.message).then(message => message.delete(10000));
    } else {
      message.reply(
        'You withdrew ' +
          amount +
          ' RVN to ' +
          address +
          '\n' +
          txLink(txId) +
          '\n'
      );
    }
  });
}

function doTip(bot, message, tipper, words, helpmsg, MultiorRole) {
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
    message
      .reply("I don't know how to tip that many Raven coins...")
      .then(message => message.delete(10000));
    return;
  }

  if (message.mentions.users.first().id) {
    sendRVN(
      bot,
      message,
      tipper,
      message.mentions.users.first().id.replace('!', ''),
      amount,
      prv,
      MultiorRole
    );
  } else {
    message
      .reply('Sorry, I could not find a user in your tip...')
      .then(message => message.delete(10000));
  }
}

function doMultiTip(bot, message, tipper, words, helpmsg, MultiorRole) {
  if (!words) {
    doHelp(message, helpmsg);
    return;
  }
  if (words.length < 4) {
    doTip(bot, message, tipper, words, helpmsg, MultiorRole);
    return;
  }
  var prv = false;
  if (words.length >= 5 && words[1] === 'private') {
    prv = true;
  }
  let [userIDs, amount] = findUserIDsAndAmount(message, words, prv);
  if (amount == null) {
    message
      .reply("I don't know how to tip that many Raven coins...")
      .then(message => message.delete(10000));
    return;
  }
  if (!userIDs) {
    message
      .reply('Sorry, I could not find a user in your tip...')
      .then(message => message.delete(10000));
    return;
  }
  for (var i = 0; i < userIDs.length; i++) {
    sendRVN(
      bot,
      message,
      tipper,
      userIDs[i].toString(),
      amount,
      prv,
      MultiorRole
    );
  }
}

function doRoleTip(bot, message, tipper, words, helpmsg, MultiorRole) {
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
    message
      .reply("I don't know how to tip that many Raven coins...")
      .then(message => message.delete(10000));
    return;
  }
  if (message.mentions.roles.first().id) {
    if (message.mentions.roles.first().members.first().id) {
      let userIDs = message.mentions.roles
        .first()
        .members.map(member => member.user.id.replace('!', ''));
      for (var i = 0; i < userIDs.length; i++) {
        sendRVN(bot, message, tipper, userIDs[i], amount, prv, MultiorRole);
      }
    } else {
      message
        .reply('Sorry, I could not find any users to tip in that role...')
        .then(message => message.delete(10000));
      return;
    }
  } else {
    message
      .reply('Sorry, I could not find any roles in your tip...')
      .then(message => message.delete(10000));
    return;
  }
}

function findUserIDsAndAmount(message, words, prv) {
  var idList = [];
  var amount = null;
  var count = 0;
  var startOffset = 1;
  if (prv) startOffset = 2;
  var regex = new RegExp(/<@!?[0-9]+>/);
  for (var i = startOffset; i < words.length; i++) {
    if (regex.test(words[i])) {
      count++;
      idList.push(words[i].match(/[0-9]+/));
    } else {
      amount = getValidatedAmount(words[Number(count) + startOffset]);
      if (amount == null) break;
      break;
    }
  }
  return [idList, amount];
}

function sendRVN(
  bot,
  message,
  tipper,
  recipient,
  amount,
  privacyFlag,
  MultiorRole
) {
  getAddress(recipient.toString(), function(err, address) {
    if (err) {
      message.reply(err.message).then(message => message.delete(10000));
    } else {
      raven.sendFrom(tipper, address, Number(amount), 1, null, null, function(
        err,
        txId
      ) {
        if (err) {
          message.reply(err.message).then(message => message.delete(10000));
        } else {
          if (privacyFlag) {
            let userProfile = message.guild.members.find('id', recipient);
            var iimessage =
              ' You got privately tipped ' +
              amount +
              ' RVN\n' +
              txLink(txId) +
              '\n' +
              'DM me `!tiprvn` for rvnTipper instructions.';
            userProfile.user.send(iimessage);
            var imessage =
              ' You privately tipped ' +
              userProfile.user.username +
              ' ' +
              amount +
              ' RVN\n' +
              txLink(txId) +
              '\n' +
              'DM me `!tiprvn` for rvnTipper instructions.';
            message.author.send(imessage);

            if (
              message.content.startsWith('!tiprvn private ') ||
              message.content.startsWith('!multitiprvn private ') ||
              message.content.startsWith('!roletiprvn private ')
            ) {
              message.delete(1000); //Supposed to delete message
            }
          } else {
            var iiimessage =
              ' tipped <@' +
              recipient +
              '> ' +
              amount +
              ' RVN\n' +
              txLink(txId) +
              '\n' +
              'DM me `!tiprvn` for rvnTipper instructions.';
            if (MultiorRole) {
              bot.channels
                .get(spamchannel)
                .send('<@' + tipper + '>,' + iiimessage);
            } else {
              message.reply(iiimessage);
            }
          }
        }
      });
    }
  });
}

function getAddress(userId, cb) {
  raven.getAddressesByAccount(userId, function(err, addresses) {
    if (err) {
      cb(err);
    } else if (addresses.length > 0) {
      cb(null, addresses[0]);
    } else {
      raven.getNewAddress(userId, function(err, address) {
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
  if (msg.channel.type == 'dm' || msg.channel.id === spamchannel) {
    return true;
  } else {
    return false;
  }
}

function getValidatedAmount(amount) {
  amount = amount.trim();
  if (amount.toLowerCase().endsWith('rvn')) {
    amount = amount.substring(0, amount.length - 3);
  }
  return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
}

function txLink(txId) {
  return 'http://threeeyed.info/tx/' + txId;
}
