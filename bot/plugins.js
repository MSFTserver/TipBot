'use strict';

const fs = require('fs'),
  path = require('path');

function getPlugins(srcpath) {
  return fs.readdirSync(srcpath);
}
let plugin_directory = path.join(__dirname, 'modules');
let plugins = getPlugins(plugin_directory);

exports.init = function init() {
  load_plugins();
};

function load_plugins() {
  const dbot = require('./bot.js');
  let commandCount = 0;
  let otherFunc = 0;
  for (let i = 0; i < plugins.length; i++) {
    let plugin;
    try {
      plugin = require(`${plugin_directory}/${plugins[i]}`);
    } catch (err) {
      console.log(`Improper setup of the '${plugins[i]}' plugin. : ${err}`);
    }
    if (plugin) {
      if ('commands' in plugin) {
        for (let j = 0; j < plugin.commands.length; j++) {
          if (plugin.commands[j] in plugin) {
            dbot.addCommand(plugin.commands[j], plugin[plugin.commands[j]]);
            commandCount++;
          }
        }
      }
      if ('custom' in plugin) {
        for (let j = 0; j < plugin.custom.length; j++) {
          if (plugin.custom[j] in plugin) {
            dbot.addCustomFunc(plugin[plugin.custom[j]]);
            otherFunc++;
          }
        }
      }
    }
  }
  console.log(`Loaded ${dbot.commandCount()} chat commands and ${otherFunc} custom functions.`);
}
