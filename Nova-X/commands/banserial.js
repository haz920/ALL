const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banserial')
        .setDescription('Ban a serial with a reason')
        .addStringOption(option =>
            option.setName('serial')
                .setDescription('Serial to ban')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
    async execute(interaction) {
        const serial = interaction.options.getString('serial');
        const reason = interaction.options.getString('reason');
        const bannedBy = interaction.user.tag;

        try {
            await interaction.deferReply();

            // Ban the serial
            await db.banSerial(serial, reason, bannedBy);

            const embed = successEmbed(
                'Serial Banned',
                `**Serial:** \`${serial}\`\n` +
                `**Reason:** ${reason}\n` +
                `**Banned by:** ${bannedBy}`
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in banserial command:', error);
            await interaction.editReply({
                embeds: [errorEmbed('Error', 'An error occurred while banning the serial. It may already be banned.')]
            });
        }
    }
};
