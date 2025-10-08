# Nova-X MTA Discord Bot

A powerful Discord bot for managing Multi Theft Auto (MTA) server operations, including player management, bans, money, and admin permissions.

## 🌟 Features

### Player Management
- **+info** `<username/ID>` - Show full info about a player account
- **+banlist** - Show serial banned list
- **+banserial** `<serial>` `<reason>` - Ban a serial with a reason
- **+unbans** `<serial/accountID>` - Unban a player by serial or account ID

### Money System
- **+topmoney** - Top Money leaderboard
- **+topmoneybank** - Top Money Bank leaderboard
- **+givemoney** `<username/id>` `<amount>` - Give money to a player
- **+givemoneybank** `<username/id>` `<amount>` - Give Money Bank to a player
- **+removemoney** `<username/id>` `<amount>` - Remove money from a player
- **+removemoneybank** `<username/id>` `<amount>` - Remove Money Bank from a player

### Admin Management
- **+alladmins** - All Admins & Supporters list
- **+giveadmin** `<username>` `<admin/supporter>` `<value>` - Give admin permissions
- **+removeadmin** `<username>` - Remove admin permissions

### Character Management
- **+removecharacter** `<id>` - Remove Character from database

## 📋 Prerequisites

- Node.js v16.9.0 or higher
- MySQL 5.7 or higher
- Discord Bot Token
- MTA Server with MySQL database

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Nova-X
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Import the database schema:
     ```bash
     mysql -u root -p < db.sql
     ```
   - Or manually create the database using the SQL file

4. **Configuration**
   - Copy `config.json` and fill in your details:
     ```json
     {
       "token": "YOUR_BOT_TOKEN",
       "clientId": "YOUR_CLIENT_ID",
       "guildId": "YOUR_GUILD_ID",
       "database": {
         "host": "localhost",
         "user": "root",
         "password": "your_password",
         "database": "mta_server",
         "port": 3306
       }
     }
     ```

5. **Start the bot**
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
Nova-X/
├── config.json          # Bot configuration
├── index.js             # Main bot file
├── package.json         # Dependencies
├── db.js               # Database connection & queries
├── db.sql              # Database schema
├── commands/           # Slash commands
│   ├── info.js
│   ├── banlist.js
│   ├── banserial.js
│   ├── unbans.js
│   ├── topmoney.js
│   ├── topmoneybank.js
│   ├── alladmins.js
│   ├── giveadmin.js
│   ├── removeadmin.js
│   ├── givemoney.js
│   ├── givemoneybank.js
│   ├── removemoney.js
│   ├── removemoneybank.js
│   └── removecharacter.js
├── events/             # Event handlers
│   └── ready.js
└── utils/              # Utility functions
    └── embeds.js
```

## 🎨 Admin Levels

- **Level 9** - 👑 Owner
- **Level 8** - ⭐ Head Admin
- **Level 7** - 🔴 Senior Admin
- **Level 6** - 🟠 Admin
- **Level 5** - 🟡 Moderator
- **Level 4** - 🟢 Trial Moderator
- **Level 3** - 🔵 Senior Supporter
- **Level 2** - 🟣 Supporter
- **Level 1** - ⚪ Trial Supporter

## 🔒 Permissions

Commands require specific Discord permissions:
- **Ban Commands**: `BanMembers` permission
- **Admin/Money Commands**: `Administrator` permission

## 🛠️ Development

```bash
# Install dev dependencies
npm install --save-dev nodemon

# Run in development mode
npm run dev
```

## 📝 Database Schema

The bot requires the following MySQL tables:
- `accounts` - Player accounts
- `characters` - Player characters
- `serialbans` - Serial bans
- `accountbans` - Account bans
- `admin_logs` - Admin action logs

See `db.sql` for the complete schema.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Important Notes

- Always backup your database before making changes
- Keep your bot token and database credentials secure
- Never commit `config.json` to version control
- Test commands in a development server first

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

Made with ❤️ for Nova-X MTA Server
