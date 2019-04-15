/*let cmd = require('node-cmd');
let shell = require('shelljs');
let moment = require('moment-timezone');
let isWindows = require('check-if-windows');
let bot.msg.[userID] = require('../helpers.js').bot.msg.[userID];
let config = require('config');
let logChannel = config.get('moderation').logchannel;
let pm2Name = config.get('General').pm2Name;
exports.commands = ['shutdown'];
exports.shutdown = {
  usage: '<pm2-name>',
  description:
    ':desktop: :construction_worker: shuts down bot via pm2 :construction_worker: :desktop:',
  process: function(bot, msg, suffix) {
    if (bot.msg.[userID](msg)) {
      if (suffix != pm2Name) {
        return;
      }
      var time = moment()
        .tz('America/Los_Angeles')
        .format('MM-DD-YYYY hh:mm a');
      msg.channel.send('Shutting Down pm2 app (' + pm2Name + ')');
      bot.channels
        .get(logChannel)
        .send(
          '[' + time + ' PST][' + pm2Name + '] Shutting Down pm2 app (veronica)'
        );
      if (isWindows) {
        cmd.run('pm2 stop ' + pm2Name);
      } else {
        shell.exec('pm2 stop ' + pm2Name);
      }
    }
  }
};
*/
