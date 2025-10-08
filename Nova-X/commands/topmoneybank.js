const db = require('../db');
const { EmbedBuilder } = require('discord.js');
const { formatCurrency } = require('../utils/helpers');

module.exports = {
  name: 'topmoneybank',
  description: 'Top Money Bank',
  usage: '+topmoneybank',
  async execute(message) {
    const rows = await db.query('SELECT username, bank FROM players ORDER BY bank DESC LIMIT 10');
    if (!rows.length) return message.reply('No players found.');

    const lines = rows.map((r, i) => `#${i + 1} ${r.username}: ${formatCurrency(r.bank)} $`);
    const embed = new EmbedBuilder().setColor(0x3498db).setTitle('Top Money Bank').setDescription(lines.join('\n'));
    return message.reply({ embeds: [embed] });
  }
};
