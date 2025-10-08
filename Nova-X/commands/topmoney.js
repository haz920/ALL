const db = require('../db');
const { EmbedBuilder } = require('discord.js');
const { formatCurrency } = require('../utils/helpers');

module.exports = {
  name: 'topmoney',
  description: 'Top Money',
  usage: '+topmoney',
  async execute(message) {
    const rows = await db.query('SELECT username, money FROM players ORDER BY money DESC LIMIT 10');
    if (!rows.length) return message.reply('No players found.');

    const lines = rows.map((r, i) => `#${i + 1} ${r.username}: ${formatCurrency(r.money)} $`);
    const embed = new EmbedBuilder().setColor(0x2ecc71).setTitle('Top Money').setDescription(lines.join('\n'));
    return message.reply({ embeds: [embed] });
  }
};
