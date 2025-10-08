const { Events, ActivityType } = require('discord.js');
const { REST, Routes } = require('discord.js');
const config = require('../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`\n🚀 Nova-X Bot is ready!`);
        console.log(`📱 Logged in as: ${client.user.tag}`);
        console.log(`🎮 Serving ${client.guilds.cache.size} server(s)`);
        console.log(`👥 Watching ${client.users.cache.size} user(s)\n`);

        // Set bot status
        client.user.setActivity('Nova-X MTA Server', { type: ActivityType.Watching });

        // Register slash commands
        try {
            console.log('🔄 Started refreshing application (/) commands...');

            const commands = [];
            const commandsPath = path.join(__dirname, '../commands');
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(path.join(commandsPath, file));
                if (command.data) {
                    commands.push(command.data.toJSON());
                }
            }

            const rest = new REST().setToken(config.token);

            // Register commands globally or to specific guild
            if (config.guildId) {
                // Guild commands (faster updates for development)
                await rest.put(
                    Routes.applicationGuildCommands(config.clientId, config.guildId),
                    { body: commands }
                );
                console.log(`✅ Successfully registered ${commands.length} guild commands`);
            } else {
                // Global commands
                await rest.put(
                    Routes.applicationCommands(config.clientId),
                    { body: commands }
                );
                console.log(`✅ Successfully registered ${commands.length} global commands`);
            }

            console.log('✅ Application commands refreshed successfully!\n');
        } catch (error) {
            console.error('❌ Error registering commands:', error);
        }
    }
};
