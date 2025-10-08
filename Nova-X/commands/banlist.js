const db = require('../db');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'banlist',
  description: 'Show serial banned list',
  usage: '+banlist',
  async execute(message) {
    const rows = await db.query('SELECT serial, reason, created_at FROM bans ORDER BY created_at DESC LIMIT 20');
    if (!rows.length) return message.reply('No banned serials found.');

    const desc = rows
      .map((b, i) => `#${i + 1} • ${b.serial} — ${b.reason}`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor(0xe67e22)
      .setTitle('Banned Serials')
      .setDescription(desc)
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }
};
