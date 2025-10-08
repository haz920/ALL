const db = require('../db');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'alladmins',
  description: 'All Admins & Supporters',
  usage: '+alladmins',
  async execute(message) {
    const rows = await db.query('SELECT username, level, value FROM admins ORDER BY level, value DESC, username');
    if (!rows.length) return message.reply('No admins found.');

    const groups = rows.reduce((acc, r) => {
      acc[r.level] = acc[r.level] || [];
      acc[r.level].push(`${r.username} — ${r.value}`);
      return acc;
    }, {});

    const embed = new EmbedBuilder().setColor(0x9b59b6).setTitle('Admins & Supporters');
    for (const key of Object.keys(groups)) {
      embed.addFields({ name: key.toUpperCase(), value: groups[key].join('\n') });
    }

    return message.reply({ embeds: [embed] });
  }
};
