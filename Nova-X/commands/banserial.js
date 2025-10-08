const db = require('../db');
const { isAdminUser } = require('../utils/helpers');

module.exports = {
  name: 'banserial',
  description: 'Ban a serial with a reason',
  usage: '+banserial <serial> <reason>',
  async execute(message, args) {
    if (!isAdminUser(message)) return message.reply('You need Administrator permission.');

    const serial = args.shift();
    const reason = args.join(' ').trim();
    if (!serial || !reason) return message.reply('Usage: +banserial <serial> <reason>');

    await db.query('INSERT INTO bans (serial, reason) VALUES (?, ?)', [serial, reason]);
    return message.reply(`Banned serial ${serial} for: ${reason}`);
  }
};
