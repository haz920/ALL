const mysql = require('mysql2/promise');
const config = require('./config.json');

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.mysql.host,
      port: config.mysql.port,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
    });
  }
  return pool;
}

async function query(sql, params = {}) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

async function getAccountByUsernameOrId(identifier) {
  if (/^\d+$/.test(identifier)) {
    const rows = await query('SELECT * FROM accounts WHERE id = :id', { id: Number(identifier) });
    return rows[0] || null;
  }
  const rows = await query('SELECT * FROM accounts WHERE username = :username', { username: String(identifier) });
  return rows[0] || null;
}

async function ensureAccount(username, serial = null) {
  const existing = await getAccountByUsernameOrId(username);
  if (existing) return existing;
  const result = await query('INSERT INTO accounts (username, serial) VALUES (:username, :serial)', { username, serial });
  const rows = await query('SELECT * FROM accounts WHERE id = :id', { id: result.insertId });
  return rows[0];
}

async function getCharactersByAccount(accountId) {
  return await query('SELECT * FROM characters WHERE account_id = :accountId ORDER BY money DESC', { accountId });
}

async function getBanList(limit = 20) {
  return await query(`SELECT b.*, a.username FROM bans b LEFT JOIN accounts a ON a.id = b.account_id ORDER BY b.created_at DESC LIMIT :limit`, { limit });
}

async function banSerial(serial, reason, bannedBy = null) {
  await query('INSERT INTO bans (serial, reason, banned_by) VALUES (:serial, :reason, :bannedBy)', { serial, reason, bannedBy });
}

async function unbanBySerialOrAccount(identifier) {
  if (/^\d+$/.test(identifier)) {
    const accountId = Number(identifier);
    const res = await query('DELETE FROM bans WHERE account_id = :accountId', { accountId });
    return res.affectedRows;
  }
  const res = await query('DELETE FROM bans WHERE serial = :serial', { serial: identifier });
  return res.affectedRows;
}

async function getTopMoney(limit = 10) {
  return await query(`SELECT a.id AS account_id, a.username, SUM(c.money) AS total_money
                      FROM accounts a
                      JOIN characters c ON c.account_id = a.id
                      GROUP BY a.id, a.username
                      ORDER BY total_money DESC
                      LIMIT :limit`, { limit });
}

async function getTopMoneyBank(limit = 10) {
  return await query(`SELECT a.id AS account_id, a.username, SUM(c.bank_money) AS total_bank
                      FROM accounts a
                      JOIN characters c ON c.account_id = a.id
                      GROUP BY a.id, a.username
                      ORDER BY total_bank DESC
                      LIMIT :limit`, { limit });
}

async function getAllAdmins() {
  return await query(`SELECT a.username, ad.role, ad.value FROM admins ad JOIN accounts a ON a.id = ad.account_id ORDER BY ad.role, a.username`);
}

async function giveAdmin(usernameOrId, role, value) {
  const account = await getAccountByUsernameOrId(usernameOrId);
  if (!account) throw new Error('Account not found');
  await query(`INSERT INTO admins (account_id, role, value)
               VALUES (:accountId, :role, :value)
               ON DUPLICATE KEY UPDATE value = VALUES(value)`,
    { accountId: account.id, role, value });
  return account;
}

async function removeAdmin(usernameOrId) {
  const account = await getAccountByUsernameOrId(usernameOrId);
  if (!account) throw new Error('Account not found');
  const res = await query('DELETE FROM admins WHERE account_id = :accountId', { accountId: account.id });
  return { affected: res.affectedRows, account };
}

async function adjustMoney(usernameOrId, amount) {
  const account = await getAccountByUsernameOrId(usernameOrId);
  if (!account) throw new Error('Account not found');
  await query('UPDATE characters SET money = money + :amount WHERE account_id = :accountId', { amount, accountId: account.id });
  return account;
}

async function adjustBankMoney(usernameOrId, amount) {
  const account = await getAccountByUsernameOrId(usernameOrId);
  if (!account) throw new Error('Account not found');
  await query('UPDATE characters SET bank_money = bank_money + :amount WHERE account_id = :accountId', { amount, accountId: account.id });
  return account;
}

async function removeCharacter(characterId) {
  const res = await query('DELETE FROM characters WHERE id = :id', { id: Number(characterId) });
  return res.affectedRows;
}

module.exports = {
  query,
  getAccountByUsernameOrId,
  ensureAccount,
  getCharactersByAccount,
  getBanList,
  banSerial,
  unbanBySerialOrAccount,
  getTopMoney,
  getTopMoneyBank,
  getAllAdmins,
  giveAdmin,
  removeAdmin,
  adjustMoney,
  adjustBankMoney,
  removeCharacter,
};
