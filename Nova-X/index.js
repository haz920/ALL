const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Load command modules
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  // Register slash commands
  const rest = new REST({ version: '10' }).setToken(config.token);
  const slashData = client.commands.map(cmd => cmd.data.toJSON());
  try {
    if (config.guildId && config.guildId !== 'OPTIONAL_GUILD_ID_FOR_GUILD_COMMANDS') {
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: slashData });
      console.log('Registered guild slash commands.');
    } else {
      await rest.put(Routes.applicationCommands(config.clientId), { body: slashData });
      console.log('Registered global slash commands.');
    }
  } catch (err) {
    console.error('Slash command registration failed:', err);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: 'There was an error executing that command.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
    }
  }
});

client.login(config.token);
