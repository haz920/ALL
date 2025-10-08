-- Nova-X MTA Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS mta_server CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mta_server;

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    serial VARCHAR(64) UNIQUE NOT NULL,
    admin_level INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_serial (serial),
    INDEX idx_username (username),
    INDEX idx_admin (admin_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account INT NOT NULL,
    charname VARCHAR(50) NOT NULL,
    money BIGINT DEFAULT 0,
    bankmoney BIGINT DEFAULT 0,
    skin INT DEFAULT 0,
    x FLOAT DEFAULT 0,
    y FLOAT DEFAULT 0,
    z FLOAT DEFAULT 0,
    rotation FLOAT DEFAULT 0,
    interior INT DEFAULT 0,
    dimension INT DEFAULT 0,
    health FLOAT DEFAULT 100,
    armor FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_played TIMESTAMP NULL,
    FOREIGN KEY (account) REFERENCES accounts(id) ON DELETE CASCADE,
    INDEX idx_account (account),
    INDEX idx_charname (charname),
    INDEX idx_money (money),
    INDEX idx_bankmoney (bankmoney)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Serial bans table
CREATE TABLE IF NOT EXISTS serialbans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serial VARCHAR(64) NOT NULL,
    reason TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    banned_by VARCHAR(50),
    expires_at TIMESTAMP NULL,
    INDEX idx_serial (serial),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Account bans table
CREATE TABLE IF NOT EXISTS accountbans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    reason TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    banned_by VARCHAR(50),
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    INDEX idx_account (account_id),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target VARCHAR(100),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin (admin_name),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data (optional)
-- INSERT INTO accounts (username, password, serial, admin_level) VALUES
-- ('admin', 'hashedpassword', 'ADMIN123456789', 9),
-- ('player1', 'hashedpassword', 'PLAYER123456789', 0);

-- INSERT INTO characters (account, charname, money, bankmoney) VALUES
-- (1, 'Admin_Character', 50000, 100000),
-- (2, 'Player_Character', 5000, 10000);
