const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeadmin')
        .setDescription('Remove admin permissions from a player')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username to remove admin from')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const username = interaction.options.getString('username');

        try {
            await interaction.deferReply();

            const result = await db.removeAdmin(username);

            if (result.affectedRows === 0) {
                return interaction.editReply({
                    embeds: [errorEmbed('User Not Found', `No user found with username: **${username}**`)]
                });
            }

            const embed = successEmbed(
                'Admin Removed',
                `**Username:** ${username}\n` +
                `**Removed by:** ${interaction.user.tag}\n\n` +
                `Admin permissions have been revoked.`
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in removeadmin command:', error);
            await interaction.editReply({
                embeds: [errorEmbed('Error', 'An error occurred while removing admin permissions.')]
            });
        }
    }
};
