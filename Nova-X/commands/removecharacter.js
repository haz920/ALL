const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { successEmbed, errorEmbed, warningEmbed } = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removecharacter')
        .setDescription('Remove Character from database')
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('Character ID to remove')
                .setRequired(true)
                .setMinValue(1)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const characterId = interaction.options.getInteger('id');

        try {
            await interaction.deferReply();

            const result = await db.removeCharacter(characterId);

            if (result.affectedRows === 0) {
                return interaction.editReply({
                    embeds: [errorEmbed('Character Not Found', `No character found with ID: **${characterId}**`)]
                });
            }

            const embed = successEmbed(
                '🗑️ Character Removed',
                `**Character ID:** ${characterId}\n` +
                `**Removed by:** ${interaction.user.tag}\n\n` +
                `⚠️ This action cannot be undone!`
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in removecharacter command:', error);
            await interaction.editReply({
                embeds: [errorEmbed('Error', 'An error occurred while removing the character.')]
            });
        }
    }
};
