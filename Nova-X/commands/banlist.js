const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');
const { infoEmbed, errorEmbed, formatDate } = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banlist')
        .setDescription('Show serial banned list'),
    
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const bans = await db.getSerialBans();

            if (!bans || bans.length === 0) {
                return interaction.editReply({
                    embeds: [infoEmbed('Ban List', '🟢 No active bans found.')]
                });
            }

            const banList = bans.slice(0, 10).map((ban, index) => {
                const reason = ban.reason || 'No reason specified';
                const bannedBy = ban.banned_by || 'Unknown';
                const date = formatDate(ban.date);
                
                return `**${index + 1}.** Serial: \`${ban.serial}\`\n` +
                       `   ├ Reason: ${reason}\n` +
                       `   ├ Banned by: ${bannedBy}\n` +
                       `   └ Date: ${date}\n`;
            }).join('\n');

            const embed = infoEmbed(
                '🚫 Serial Ban List',
                `Showing ${Math.min(bans.length, 10)} of ${bans.length} total bans\n\n${banList}`
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in banlist command:', error);
            await interaction.editReply({
                embeds: [errorEmbed('Error', 'An error occurred while fetching the ban list.')]
            });
        }
    }
};
