const { EmbedBuilder } = require('discord.js');

function green(title, description) {
  return new EmbedBuilder().setColor(0x2ecc71).setTitle(title).setDescription(description).setTimestamp();
}

function red(title, description) {
  return new EmbedBuilder().setColor(0xe74c3c).setTitle(title).setDescription(description).setTimestamp();
}

function yellow(title, description) {
  return new EmbedBuilder().setColor(0xf1c40f).setTitle(title).setDescription(description).setTimestamp();
}

module.exports = { green, red, yellow };
