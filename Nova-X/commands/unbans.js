const db = require('../db');
const { isAdminUser } = require('../utils/helpers');

module.exports = {
  name: 'unbans',
  description: 'Unban a player by serial or accountID',
  usage: '+unbans <serial|accountId>',
  async execute(message, args) {
    if (!isAdminUser(message)) return message.reply('You need Administrator permission.');

    const identifier = args.join(' ');
    if (!identifier) return message.reply('Usage: +unbans <serial|accountId>');

    let serial = identifier;
    // If looks like account id (not long hex), try resolve to serial
    const isLikelySerial = /^[a-z0-9]{16,}$/i.test(identifier);
    if (!isLikelySerial) {
      const rows = await db.query('SELECT serial FROM players WHERE account_id = ? LIMIT 1', [identifier]);
      if (rows[0]) serial = rows[0].serial;
    }

    if (!serial) return message.reply('Could not resolve a serial for that identifier.');

    const result = await db.query('DELETE FROM bans WHERE serial = ?', [serial]);
    return message.reply(`Unbanned serial: ${serial}`);
  }
};
