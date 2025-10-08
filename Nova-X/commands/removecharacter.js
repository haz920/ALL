const db = require('../db');
const { isAdminUser } = require('../utils/helpers');

module.exports = {
  name: 'removecharacter',
  description: 'Remove a character by id',
  usage: '+removecharacter <id>',
  async execute(message, args) {
    if (!isAdminUser(message)) return message.reply('You need Administrator permission.');

    const id = Number(args[0]);
    if (!Number.isFinite(id)) return message.reply('Usage: +removecharacter <id>');

    await db.query('DELETE FROM players WHERE id = ?', [id]);
    return message.reply(`Removed character with id ${id}.`);
  }
};
