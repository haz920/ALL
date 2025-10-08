const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unbans')
        .setDescription('Unban a player by serial or account ID')
        .addStringOption(option =>
            option.setName('identifier')
                .setDescription('Serial or Account ID to unban')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
    async execute(interaction) {
        const identifier = interaction.options.getString('identifier');

        try {
            await interaction.deferReply();

            const result = await db.unbanPlayer(identifier);

            if (result.affectedRows === 0) {
                return interaction.editReply({
                    embeds: [errorEmbed('Not Found', `No ban found for: **${identifier}**`)]
                });
            }

            const embed = successEmbed(
                'Player Unbanned',
                `Successfully unbanned: **${identifier}**\n` +
                `Unbanned by: ${interaction.user.tag}`
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in unbans command:', error);
            await interaction.editReply({
                embeds: [errorEmbed('Error', 'An error occurred while unbanning the player.')]
            });
        }
    }
};
