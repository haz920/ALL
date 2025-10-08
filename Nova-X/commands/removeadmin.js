const db = require('../db');
const { isAdminUser } = require('../utils/helpers');

module.exports = {
  name: 'removeadmin',
  description: 'Remove admin',
  usage: '+removeadmin <username>',
  async execute(message, args) {
    if (!isAdminUser(message)) return message.reply('You need Administrator permission.');
    const username = args[0];
    if (!username) return message.reply('Usage: +removeadmin <username>');
    await db.query('DELETE FROM admins WHERE username = ?', [username]);
    return message.reply(`Removed admin ${username}.`);
  }
};
