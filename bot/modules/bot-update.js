/*let cmd = require('node-cmd');
let moment = require('moment-timezone');
let config = require('config');
let botDev = config.get('moderation').botDev;
let logChannel = config.get('moderation').logchannel;
let pm2Name = config.get('moderation').pm2Name;

exports.commands = ['update'];

exports.update = {
  usage: '<pm2-name>',
  description: 'updates the bot via pm2 for no down time!',
  process: function(bot, msg, suffix) {
    if (isBotDev(msg)) {
      if (suffix != pm2Name) {
        return;
      }
      var time = moment()
        .tz('America/Los_Angeles')
        .format('MM-DD-YYYY hh:mm a');
      msg.channel.send('Updating pm2 app(' + pm2Name + ')');
      bot.channels
        .get(logChannel)
        .send('[' + time + ' PST][' + pm2Name + '] Updating pm2 app');
      cmd.run(
          'cd ' +
            botDir +
            ' git pull origin master && npm install && pm2 update all'
        );
    }
    // Checks if user is an Bot Dev!
    function isBotDev(msg) {
      return msg.member.roles.some(r => botDev.includes(r.name));
    }
  }
};
*/
