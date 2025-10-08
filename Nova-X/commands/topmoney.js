const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');
const { infoEmbed, errorEmbed, formatMoney } = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('topmoney')
        .setDescription('Top Money leaderboard'),
    
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const topPlayers = await db.getTopMoney(10);

            if (!topPlayers || topPlayers.length === 0) {
                return interaction.editReply({
                    embeds: [infoEmbed('Top Money', 'No players found.')]
                });
            }

            const leaderboard = topPlayers.map((player, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `**${index + 1}.**`;
                const total = player.total || 0;
                const cash = player.money || 0;
                const bank = player.bankmoney || 0;
                
                return `${medal} **${player.charname}**\n` +
                       `   └ Total: ${formatMoney(total)} (Cash: ${formatMoney(cash)} | Bank: ${formatMoney(bank)})`;
            }).join('\n\n');

            const embed = infoEmbed(
                '💰 Top Money Leaderboard',
                leaderboard
            );
            embed.setThumbnail('https://i.imgur.com/AfFp7pu.png');

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in topmoney command:', error);
            await interaction.editReply({
                embeds: [errorEmbed('Error', 'An error occurred while fetching the leaderboard.')]
            });
        }
    }
};
