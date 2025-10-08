const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { successEmbed, errorEmbed, formatMoney } = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removemoneybank')
        .setDescription('Remove Money Bank from a player')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username/ID to remove bank money from')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of bank money to remove')
                .setRequired(true)
                .setMinValue(1)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const identifier = interaction.options.getString('username');
        const amount = interaction.options.getInteger('amount');

        try {
            await interaction.deferReply();

            const result = await db.removeMoney(identifier, amount, true);

            if (result.affectedRows === 0) {
                return interaction.editReply({
                    embeds: [errorEmbed('Player Not Found', `No player found with identifier: **${identifier}**`)]
                });
            }

            const embed = successEmbed(
                '🏦 Bank Money Removed',
                `**Player:** ${identifier}\n` +
                `**Amount:** ${formatMoney(amount)}\n` +
                `**Removed by:** ${interaction.user.tag}`
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in removemoneybank command:', error);
            await interaction.editReply({
                embeds: [errorEmbed('Error', 'An error occurred while removing bank money.')]
            });
        }
    }
};
