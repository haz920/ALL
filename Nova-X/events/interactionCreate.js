const { Events } = require('discord.js');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
            console.log(`✅ ${interaction.user.tag} executed /${interaction.commandName}`);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);

            const embed = errorEmbed(
                'Command Error',
                'There was an error while executing this command!'
            );

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [embed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
};
