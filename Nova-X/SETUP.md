# 🚀 Quick Setup Guide - Nova-X MTA Bot

## Step 1: Install Dependencies

```bash
cd Nova-X
npm install
```

## Step 2: Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "Nova-X Bot"
4. Go to "Bot" section
5. Click "Add Bot"
6. **Copy the Bot Token** (you'll need this!)
7. Enable these **Privileged Gateway Intents**:
   - ✅ Server Members Intent
   - ✅ Message Content Intent

## Step 3: Invite Bot to Server

1. Go to "OAuth2" → "URL Generator"
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ Administrator (or specific permissions you need)
4. Copy the generated URL and open it in your browser
5. Select your server and authorize

## Step 4: Configure Database

### Import the database schema:

```bash
# Login to MySQL
mysql -u root -p

# Create and import database
source db.sql
```

Or manually:
```bash
mysql -u root -p < db.sql
```

## Step 5: Configure Bot

Edit `config.json` with your details:

```json
{
  "token": "YOUR_BOT_TOKEN_HERE",           // From Discord Developer Portal
  "clientId": "YOUR_CLIENT_ID_HERE",        // Your Application ID
  "guildId": "YOUR_GUILD_ID_HERE",          // Your Discord Server ID (right-click server → Copy ID)
  "database": {
    "host": "localhost",
    "user": "root",
    "password": "YOUR_DB_PASSWORD",
    "database": "mta_server",
    "port": 3306
  }
}
```

### How to get IDs:
- **Client ID**: Discord Developer Portal → Your Application → Application ID
- **Guild ID**: Enable Developer Mode in Discord → Right-click your server → Copy ID

## Step 6: Test Database Connection

```bash
# Make sure MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u root -p -e "USE mta_server; SHOW TABLES;"
```

You should see tables like:
- accounts
- characters
- serialbans
- accountbans
- admin_logs

## Step 7: Start the Bot

```bash
# Production
npm start

# Development (with auto-restart)
npm run dev
```

## ✅ Verification

If everything is set up correctly, you should see:

```
✅ Successfully connected to MySQL database
✅ Loaded command: info
✅ Loaded command: banlist
... (all other commands)
✅ Loaded event: ready
✅ Loaded event: interactionCreate

🚀 Nova-X Bot is ready!
📱 Logged in as: Nova-X#1234
🎮 Serving 1 server(s)
👥 Watching 50 user(s)

🔄 Started refreshing application (/) commands...
✅ Successfully registered 14 guild commands
✅ Application commands refreshed successfully!
```

## 🎮 Test Commands

In your Discord server, try:

```
/info <username>
/banlist
/topmoney
/alladmins
```

## ⚠️ Troubleshooting

### Bot doesn't respond to commands
- Make sure the bot has proper permissions in your server
- Check if slash commands are registered (may take up to 1 hour for global commands)
- Use `guildId` in config for instant updates during development

### Database connection error
- Verify MySQL is running: `sudo systemctl start mysql`
- Check database credentials in `config.json`
- Make sure database `mta_server` exists

### "Unknown interaction" error
- The bot restarted but Discord cached old commands
- Wait a few minutes or use guild-specific commands

### Commands not showing up
- Make sure bot has `applications.commands` scope
- Check bot permissions in server settings
- Re-invite bot with correct OAuth2 URL

## 🔒 Security

**IMPORTANT**: Never share these:
- ❌ Bot Token
- ❌ Database Password
- ❌ `config.json` file

**DO**:
- ✅ Add `config.json` to `.gitignore` (already done)
- ✅ Use environment variables for production
- ✅ Keep backups of your database

## 📝 Next Steps

1. Customize embed colors in `config.json`
2. Add your MTA server logo/thumbnail URLs
3. Set up automatic backups for database
4. Configure admin roles in Discord
5. Test all commands thoroughly

---

Need help? Check the [README.md](README.md) or open an issue!
