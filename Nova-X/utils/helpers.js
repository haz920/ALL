const { PermissionsBitField } = require('discord.js');
const db = require('../db');

function isAdminUser(message) {
  return (
    message.member &&
    message.member.permissions &&
    message.member.permissions.has(PermissionsBitField.Flags.Administrator)
  );
}

async function getPlayerByIdentifier(identifier) {
  if (!identifier) return null;
  const isNumeric = /^\d+$/.test(identifier);
  if (isNumeric) {
    const rows = await db.query('SELECT * FROM players WHERE id = ?', [Number(identifier)]);
    return rows[0] || null;
  }
  const rows = await db.query(
    'SELECT * FROM players WHERE username = ? OR account_id = ? LIMIT 1',
    [identifier, identifier]
  );
  return rows[0] || null;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US').format(Number(value || 0));
}

module.exports = { isAdminUser, getPlayerByIdentifier, formatCurrency };
