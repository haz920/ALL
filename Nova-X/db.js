const mysql = require('mysql2/promise');
const config = require('./config.json');

// Create connection pool
const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    port: config.database.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Successfully connected to MySQL database');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error connecting to database:', error.message);
        throw error;
    }
}

// Query helper function
async function query(sql, params) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Get player info by serial or account ID
async function getPlayerInfo(identifier) {
    const sql = `
        SELECT a.*, c.charname, c.money, c.bankmoney 
        FROM accounts a 
        LEFT JOIN characters c ON a.id = c.account 
        WHERE a.serial = ? OR a.id = ?
        LIMIT 1
    `;
    return await query(sql, [identifier, identifier]);
}

// Get serial bans
async function getSerialBans() {
    const sql = 'SELECT * FROM serialbans ORDER BY date DESC';
    return await query(sql);
}

// Ban serial
async function banSerial(serial, reason, bannedBy) {
    const sql = 'INSERT INTO serialbans (serial, reason, date, banned_by) VALUES (?, ?, NOW(), ?)';
    return await query(sql, [serial, reason, bannedBy]);
}

// Unban player
async function unbanPlayer(identifier) {
    const sql = 'DELETE FROM serialbans WHERE serial = ? OR id = ?';
    return await query(sql, [identifier, identifier]);
}

// Get top money
async function getTopMoney(limit = 10) {
    const sql = 'SELECT charname, money, bankmoney, (money + bankmoney) as total FROM characters ORDER BY total DESC LIMIT ?';
    return await query(sql, [limit]);
}

// Get top bank money
async function getTopBankMoney(limit = 10) {
    const sql = 'SELECT charname, bankmoney FROM characters ORDER BY bankmoney DESC LIMIT ?';
    return await query(sql, [limit]);
}

// Get all admins
async function getAllAdmins() {
    const sql = 'SELECT username, admin_level FROM accounts WHERE admin_level > 0 ORDER BY admin_level DESC';
    return await query(sql);
}

// Give admin
async function giveAdmin(username, adminLevel) {
    const sql = 'UPDATE accounts SET admin_level = ? WHERE username = ?';
    return await query(sql, [adminLevel, username]);
}

// Remove admin
async function removeAdmin(username) {
    const sql = 'UPDATE accounts SET admin_level = 0 WHERE username = ?';
    return await query(sql, [username]);
}

// Give money
async function giveMoney(identifier, amount, toBank = false) {
    const field = toBank ? 'bankmoney' : 'money';
    const sql = `UPDATE characters SET ${field} = ${field} + ? WHERE charname = ? OR account = ?`;
    return await query(sql, [amount, identifier, identifier]);
}

// Remove money
async function removeMoney(identifier, amount, fromBank = false) {
    const field = fromBank ? 'bankmoney' : 'money';
    const sql = `UPDATE characters SET ${field} = ${field} - ? WHERE charname = ? OR account = ?`;
    return await query(sql, [amount, identifier, identifier]);
}

// Remove character
async function removeCharacter(characterId) {
    const sql = 'DELETE FROM characters WHERE id = ?';
    return await query(sql, [characterId]);
}

module.exports = {
    pool,
    query,
    testConnection,
    getPlayerInfo,
    getSerialBans,
    banSerial,
    unbanPlayer,
    getTopMoney,
    getTopBankMoney,
    getAllAdmins,
    giveAdmin,
    removeAdmin,
    giveMoney,
    removeMoney,
    removeCharacter
};
