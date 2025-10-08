const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
const config = require('./config.json');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

// Load events
require('./events/ready')(client);

// Load commands
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath)) {
  if (!file.endsWith('.js')) continue;
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.name, command);
}

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  const prefix = config.prefix || '+';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const cmdName = args.shift()?.toLowerCase();
  const command = client.commands.get(cmdName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (err) {
    console.error(err);
    await message.reply('An error occurred while executing that command.');
  }
});

const token = process.env.TOKEN || config.token;
if (!token) {
  console.error('No Discord token provided. Set TOKEN env or config.json token.');
  process.exit(1);
}

client.login(token);
