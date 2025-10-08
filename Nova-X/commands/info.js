const db = require('../db');
const { EmbedBuilder } = require('discord.js');
const { formatCurrency } = require('../utils/helpers');

module.exports = {
  name: 'info',
  description: 'Show full info about a player account',
  usage: '+info <username|id|accountId>',
  async execute(message, args) {
    const identifier = args.join(' ');
    if (!identifier) return message.reply('Usage: +info <username|id|accountId>');

    // Resolve player by id/username/account_id
    let player;
    const isNumeric = /^\d+$/.test(identifier);
    if (isNumeric) {
      const rows = await db.query('SELECT * FROM players WHERE id = ?', [Number(identifier)]);
      player = rows[0];
    } else {
      const rows = await db.query(
        'SELECT * FROM players WHERE username = ? OR account_id = ? LIMIT 1',
        [identifier, identifier]
      );
      player = rows[0];
    }

    if (!player) return message.reply('Player not found.');

    const [admin] = await db.query('SELECT * FROM admins WHERE username = ? LIMIT 1', [player.username]);
    const bans = await db.query('SELECT * FROM bans WHERE serial = ?', [player.serial]);

    const embed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle(`Player Info: ${player.username}`)
      .addFields(
        { name: 'ID', value: String(player.id), inline: true },
        { name: 'Account ID', value: player.account_id || 'N/A', inline: true },
        { name: 'Serial', value: player.serial || 'N/A', inline: false },
        { name: 'Money', value: `${formatCurrency(player.money)} $`, inline: true },
        { name: 'Bank', value: `${formatCurrency(player.bank)} $`, inline: true },
        { name: 'Admin', value: admin ? `${admin.level} (${admin.value})` : 'No', inline: true },
        { name: 'Banned', value: bans.length ? `Yes: ${bans[0].reason}` : 'No', inline: true }
      )
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }
};
