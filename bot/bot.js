'use strict';

// Load up libraries
const Discord = require('discord.js');
// Load config!
let config = require('config');
config = config.get('bot');

var aliases;
try {
  aliases = require('./alias.json');
  console.log('aliases:');
  console.log(aliases);
} catch (e) {
  console.log('No aliases defined');
  //No aliases defined
  aliases = {
    test: {
      process: function(bot, msg) {
        msg.channel.send('test');
        console.log('test');
      }
    }
  };
}
var commands = {};

var bot = new Discord.Client();

bot.on('ready', function() {
  console.log(
    'Logged in! Serving in ' + bot.guilds.array().length + ' servers'
  );
  require('./plugins.js').init();
  console.log('type ' + config.prefix + 'help in Discord for a commands list.');
  bot.user.setActivity(config.prefix + 'Intialized!');
  var text = ['tiprvn', 'tipdoge', 'tiplbc'];
  var counter = 0;
  setInterval(change, 10000);

  function change() {
    bot.user.setActivity(config.prefix + text[counter]);
    counter++;
    if (counter >= text.length) {
      counter = 0;
    }
  }
});

process.on('uncaughtException', err =>{
    console.log('uncaughtException: ' + err);
    process.exit(1); //exit node.js with an error
});

process.on('unhandledRejection', err =>{
    console.log('unhandledRejection: ' + err);
    process.exit(1); //exit node.js with an error
});


bot.on('disconnected', function() {
  console.log('Disconnected!');
  process.exit(1); //exit node.js with an error
});

bot.on('error', function(error) {
  console.log('error: ' + error);
  process.exit(1); //exit node.js with an error
});

function checkMessageForCommand(msg, isEdit) {
  //check if message is a command
  if (msg.author.id != bot.user.id && msg.content.startsWith(config.prefix)) {
    //check if user is Online
    if (
      !msg.author.presence.status ||
      msg.author.presence.status == 'offline' ||
      msg.author.presence.status == 'invisible'
    ) {
      msg.author
        .send('Please set your Discord Presence to Online to talk to the bot!')
        .catch(function(error) {
          msg.channel
            .send(
              msg.author +
                ', Please enable Direct Messages from server members to communicate fully with our bot, it is located in the user setting area under Privacy & Safety tab, select the option allow direct messages from server members'
            )
            .then(
              msg.channel.send(
                'Please set your Discord Presence to Online to talk to the Bot!'
              )
            );
          return;
        });
    }
    var cmdTxt = msg.content.split(' ')[0].substring(config.prefix.length);
    var suffix = msg.content.substring(
      cmdTxt.length + config.prefix.length + 1
    ); //add one for the ! and one for the space
    if (msg.isMentioned(bot.user)) {
      try {
        cmdTxt = msg.content.split(' ')[1];
        suffix = msg.content.substring(
          bot.user.mention().length + cmdTxt.length + config.prefix.length + 1
        );
      } catch (e) {
        //no command
        msg.channel.send('Yes?');
        return;
      }
    }
    let alias = aliases[cmdTxt];
    if (alias) {
      var cmd = commands[alias];
    } else {
      var cmd = commands[cmdTxt];
    }
    if (cmd) {
      // Add permission check here later on ;)
      console.log(
        'treating ' + msg.content + ' from ' + msg.author + ' as command'
      );
      try {
        cmd.process(bot, msg, suffix, isEdit);
      } catch (e) {
        var msgTxt = 'command ' + cmdTxt + ' failed :(';
        if (config.debug) {
          msgTxt += '\n' + e.stack;
        }
        msg.channel.send(msgTxt);
      }
    }
  } else {
    //message isn't a command or is from us
    //drop our own messages to prevent feedback loops
    if (msg.author == bot.user) {
      return;
    }

    if (msg.author != bot.user && msg.isMentioned(bot.user)) {
      msg.channel.send('yes?'); //using a mention here can lead to looping
    } else {
    }
  }
}

bot.on('message', msg => checkMessageForCommand(msg, false));

exports.addCommand = function(commandName, commandObject) {
  try {
    commands[commandName] = commandObject;
  } catch (err) {
    console.log(err);
  }
};
exports.addCustomFunc = function(customFunc) {
  try {
    customFunc(bot);
  } catch (err) {
    console.log(err);
  }
};
exports.commandCount = function() {
  return Object.keys(commands).length;
};

bot.login(config.token);
