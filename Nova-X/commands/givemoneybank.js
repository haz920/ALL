const db = require('../db');
const { isAdminUser } = require('../utils/helpers');

module.exports = {
  name: 'givemoneybank',
  description: 'Give money to player bank',
  usage: '+givemoneybank <username|id> <amount>',
  async execute(message, args) {
    if (!isAdminUser(message)) return message.reply('You need Administrator permission.');

    const identifier = args.shift();
    const amount = Number(args.shift());
    if (!identifier || !Number.isFinite(amount)) return message.reply('Usage: +givemoneybank <username|id> <amount>');

    let column = 'id';
    let value = identifier;
    if (isNaN(Number(identifier))) {
      column = 'username';
      value = identifier;
    }
    await db.query(`UPDATE players SET bank = bank + ? WHERE ${column} = ?`, [amount, value]);
    return message.reply(`Gave ${amount} $ to bank of ${identifier}.`);
  }
};
