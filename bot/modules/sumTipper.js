'use strict';

const bitcoin = require('bitcoin');

let Regex = require('regex'),
  config = require('config'),
  spamchannels = config.get('moderation').botspamchannels;
let walletConfig = config.get('sum').config;
let paytxfee = config.get('sum').paytxfee;
const sum = new bitcoin.Client(walletConfig);

exports.commands = ['tipsum'];
exports.tipsum = {
  usage: '<subcommand>',
  description:
    '__**Sumcoin (SUM) Tipper**__\nTransaction Fees: **' + paytxfee + '**\n    **!tipsum** : Displays This Message\n    **!tipsum balance** : get your balance\n    **!tipsum deposit** : get address for your deposits\n    **!tipsum withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tipsum <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tipsum private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n    has a default txfee of ' + paytxfee,
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
        '__**Sumcoin (SUM) Tipper**__\nTransaction Fees: **' + paytxfee + '**\n    **!tipsum** : Displays This Message\n    **!tipsum balance** : get your balance\n    **!tipsum deposit** : get address for your deposits\n    **!tipsum withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tipsum <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tipsum private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n    **<> : Replace with appropriate value.**',
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
  sum.getBalance(tipper, 1, function(err, balance) {
    if (err) {
      message.reply('Error getting Sumcoin (SUM) balance.').then(message => message.delete(10000));
    } else {
    message.channel.send({ embed: {
    description: '**:bank::money_with_wings::moneybag:Sumcoin (SUM) Balance!:moneybag::money_with_wings::bank:**',
    color: 1363892,
    fields: [
      {
        name: '__User__',
        value: '<@' + message.author.id + '>',
        inline: false
      },
      {
        name: '__Balance__',
        value: '**' + balance.toString() + '**',
        inline: false
      }
    ]
  } });
    }
  });
}

function doDeposit(message, tipper) {
  getAddress(tipper, function(err, address) {
    if (err) {
      message.reply('Error getting your Sumcoin (SUM) deposit address.').then(message => message.delete(10000));
    } else {
    message.channel.send({ embed: {
    description: '**:bank::card_index::moneybag:Sumcoin (SUM) Address!:moneybag::card_index::bank:**',
    color: 1363892,
    fields: [
      {
        name: '__User__',
        value: '<@' + message.author.id + '>',
        inline: false
      },
      {
        name: '__Address__',
        value: '**' + address + '**',
        inline: false
      }
    ]
  } });
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
    message.reply("I don't know how to withdraw that much Sumcoin (SUM)...").then(message => message.delete(10000));
    return;
  }

  sum.getBalance(tipper, 1, function(err, balance) {
    if (err) {
      message.reply('Error getting Sumcoin (SUM) balance.').then(message => message.delete(10000));
    } else {
      if (Number(amount) + Number(paytxfee) > Number(balance)) {
        message.channel.send('Please leave atleast ' + paytxfee + ' Sumcoin (SUM) for transaction fees!');
        return;
      }
      sum.sendFrom(tipper, address, Number(amount), function(err, txId) {
        if (err) {
          message.reply(err.message).then(message => message.delete(10000));
        } else {
        message.channel.send({embed:{
        description: '**:outbox_tray::money_with_wings::moneybag:Sumcoin (SUM) Transaction Completed!:moneybag::money_with_wings::outbox_tray:**',
        color: 1363892,
        fields: [
          {
            name: '__Sender__',
            value: '<@' + message.author.id + '>',
            inline: true
          },
          {
            name: '__Receiver__',
            value: '**' + address + '**\n' + addyLink(address),
            inline: true
          },
          {
            name: '__txid__',
            value: '**' + txId + '**\n' + txLink(txId),
            inline: false
          },
          {
            name: '__Amount__',
            value: '**' + amount.toString() + '**',
            inline: true
          },
          {
            name: '__Fee__',
            value: '**' + paytxfee.toString() + '**',
            inline: true
          }
        ]
      }});
      }
    });
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
    message.reply("I don't know how to tip that much Sumcoin (SUM)...").then(message => message.delete(10000));
    return;
  }

  sum.getBalance(tipper, 1, function(err, balance) {
    if (err) {
      message.reply('Error getting Sumcoin (SUM) balance.').then(message => message.delete(10000));
    } else {
      if (Number(amount) + Number(paytxfee) > Number(balance)) {
        message.channel.send('Please leave atleast ' + paytxfee + ' Sumcoin (SUM) for transaction fees!');
        return;
      }

      if (!message.mentions.users.first()){
           message
            .reply('Sorry, I could not find a user in your tip...')
            .then(message => message.delete(10000));
            return;
          }
      if (message.mentions.users.first().id) {
        sendSUM(bot, message, tipper, message.mentions.users.first().id.replace('!', ''), amount, prv);
      } else {
        message.reply('Sorry, I could not find a user in your tip...').then(message => message.delete(10000));
      }
    }
  });
}

function sendSUM(bot, message, tipper, recipient, amount, privacyFlag) {
  getAddress(recipient.toString(), function(err, address) {
    if (err) {
      message.reply(err.message).then(message => message.delete(10000));
    } else {
          sum.sendFrom(tipper, address, Number(amount), 1, null, null, function(err, txId) {
              if (err) {
                message.reply(err.message).then(message => message.delete(10000));
              } else {
                if (privacyFlag) {
                  let userProfile = message.guild.members.find('id', recipient);
                  userProfile.user.send({ embed: {
                  description: '**:money_with_wings::moneybag:Sumcoin (SUM) Transaction Completed!:moneybag::money_with_wings:**',
                  color: 1363892,
                  fields: [
                    {
                      name: '__Sender__',
                      value: 'Private Tipper',
                      inline: true
                    },
                    {
                      name: '__Receiver__',
                      value: '<@' + recipient + '>',
                      inline: true
                    },
                    {
                      name: '__txid__',
                      value: '**' + txId + '**\n' + txLink(txId),
                      inline: false
                    },
                    {
                      name: '__Amount__',
                      value: '**' + amount.toString() + '**',
                      inline: true
                    },
                    {
                      name: '__Fee__',
                      value: '**' + paytxfee.toString() + '**',
                      inline: true
                    }
                  ]
                } });
                message.author.send({ embed: {
                description: '**:money_with_wings::moneybag:Sumcoin (SUM) Transaction Completed!:moneybag::money_with_wings:**',
                color: 1363892,
                fields: [
                  {
                    name: '__Sender__',
                    value: '<@' + message.author.id + '>',
                    inline: true
                  },
                  {
                    name: '__Receiver__',
                    value: '<@' + recipient + '>',
                    inline: true
                  },
                  {
                    name: '__txid__',
                    value: '**' + txId + '**\n' + txLink(txId),
                    inline: false
                  },
                  {
                    name: '__Amount__',
                    value: '**' + amount.toString() + '**',
                    inline: true
                  },
                  {
                    name: '__Fee__',
                    value: '**' + paytxfee.toString() + '**',
                    inline: true
                  }

                ]
              } });
                  if (
                    message.content.startsWith('!tipsum private ')
                  ) {
                    message.delete(1000); //Supposed to delete message
                  }
                } else {
                  message.channel.send({ embed: {
                  description: '**:money_with_wings::moneybag:Sumcoin (SUM) Transaction Completed!:moneybag::money_with_wings:**',
                  color: 1363892,
                  fields: [
                    {
                      name: '__Sender__',
                      value: '<@' + message.author.id + '>',
                      inline: true
                    },
                    {
                      name: '__Receiver__',
                      value: '<@' + recipient + '>',
                      inline: true
                    },
                    {
                      name: '__txid__',
                      value: '**' + txId + '**\n' + txLink(txId),
                      inline: false
                    },
                    {
                      name: '__Amount__',
                      value: '**' + amount.toString() + '**',
                      inline: true
                    },
                    {
                      name: '__Fee__',
                      value: '**' + paytxfee.toString() + '**',
                      inline: true
                    }
                  ]
                } });
                }
              }
            });
    }
  });
}

function getAddress(userId, cb) {
  sum.getAddressesByAccount(userId, function(err, addresses) {
    if (err) {
      cb(err);
    } else if (addresses.length > 0) {
      cb(null, addresses[0]);
    } else {
      sum.getNewAddress(userId, function(err, address) {
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
  if (amount.toLowerCase().endsWith('sum')) {
    amount = amount.substring(0, amount.length - 3);
  }
  return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
}

function txLink(txId) {
  return 'https://sumexplorer.com/tx/' + txId;
}

function addyLink(address) {
  return 'https://sumexplorer.com/address/' + address;
}
