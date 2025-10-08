const { EmbedBuilder } = require('discord.js');

function base(title) {
  return new EmbedBuilder()
    .setTitle(title)
    .setColor(0x5865F2)
    .setTimestamp(Date.now());
}

function success(description) {
  return base('Success').setDescription(description).setColor(0x57F287);
}

function error(description) {
  return base('Error').setDescription(description).setColor(0xED4245);
}

function info(title, description) {
  return base(title).setDescription(description).setColor(0x5865F2);
}

module.exports = { base, success, error, info };