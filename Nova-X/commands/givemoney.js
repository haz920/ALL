const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { successEmbed, errorEmbed, formatMoney } = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('givemoney')
        .setDescription('Give money to a player')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username/ID to give money to')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of money to give')
                .setRequired(true)
                .setMinValue(1)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const identifier = interaction.options.getString('username');
        const amount = interaction.options.getInteger('amount');

        try {
            await interaction.deferReply();

            const result = await db.giveMoney(identifier, amount, false);

            if (result.affectedRows === 0) {
                return interaction.editReply({
                    embeds: [errorEmbed('Player Not Found', `No player found with identifier: **${identifier}**`)]
                });
            }

            const embed = successEmbed(
                '💰 Money Given',
                `**Player:** ${identifier}\n` +
                `**Amount:** ${formatMoney(amount)}\n` +
                `**Given by:** ${interaction.user.tag}`
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in givemoney command:', error);
            await interaction.editReply({
                embeds: [errorEmbed('Error', 'An error occurred while giving money.')]
            });
        }
    }
};
