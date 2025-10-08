const db = require('../db');
const { isAdminUser } = require('../utils/helpers');

module.exports = {
  name: 'removemoney',
  description: 'Remove money from a player',
  usage: '+removemoney <username|id> <amount>',
  async execute(message, args) {
    if (!isAdminUser(message)) return message.reply('You need Administrator permission.');

    const identifier = args.shift();
    const amount = Number(args.shift());
    if (!identifier || !Number.isFinite(amount)) return message.reply('Usage: +removemoney <username|id> <amount>');

    let column = 'id';
    let value = identifier;
    if (isNaN(Number(identifier))) {
      column = 'username';
      value = identifier;
    }
    await db.query(`UPDATE players SET money = GREATEST(money - ?, 0) WHERE ${column} = ?`, [amount, value]);
    return message.reply(`Removed ${amount} $ from ${identifier}.`);
  }
};
