const db = require('../db');
const { isAdminUser } = require('../utils/helpers');

module.exports = {
  name: 'giveadmin',
  description: 'Give admin/supporter role with value',
  usage: '+giveadmin <username> <admin|supporter> <value>',
  async execute(message, args) {
    if (!isAdminUser(message)) return message.reply('You need Administrator permission.');

    const username = args.shift();
    const level = args.shift();
    const value = Number(args.shift());
    if (!username || !['admin', 'supporter'].includes(level || '') || !Number.isFinite(value)) {
      return message.reply('Usage: +giveadmin <username> <admin|supporter> <value>');
    }
    await db.query(
      'INSERT INTO admins (username, level, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE level = VALUES(level), value = VALUES(value)',
      [username, level, value]
    );
    return message.reply(`Gave ${level} to ${username} (value ${value}).`);
  }
};
