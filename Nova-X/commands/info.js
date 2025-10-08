const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');
const { infoEmbed, errorEmbed, formatMoney, formatDate } = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Show full info about a player account')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username or ID of the player')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        const identifier = interaction.options.getString('username');

        try {
            await interaction.deferReply();

            const playerData = await db.getPlayerInfo(identifier);

            if (!playerData || playerData.length === 0) {
                return interaction.editReply({
                    embeds: [errorEmbed('Player Not Found', `No player found with identifier: **${identifier}**`)]
                });
            }

            const player = playerData[0];
            const totalMoney = (player.money || 0) + (player.bankmoney || 0);

            const fields = [
                { name: '👤 Username', value: player.username || 'N/A', inline: true },
                { name: '🆔 Account ID', value: `${player.id}`, inline: true },
                { name: '🔑 Serial', value: `\`${player.serial}\``, inline: false },
                { name: '👮 Admin Level', value: `${player.admin_level || 0}`, inline: true },
                { name: '🎮 Character', value: player.charname || 'No character', inline: true },
                { name: '💰 Cash', value: formatMoney(player.money || 0), inline: true },
                { name: '🏦 Bank', value: formatMoney(player.bankmoney || 0), inline: true },
                { name: '💵 Total Money', value: formatMoney(totalMoney), inline: true },
                { name: '📅 Created', value: formatDate(player.created_at), inline: true },
                { name: '🕐 Last Login', value: player.last_login ? formatDate(player.last_login) : 'Never', inline: true }
            ];

            const embed = infoEmbed('Player Information', null, fields);
            embed.setThumbnail('https://i.imgur.com/AfFp7pu.png'); // Nova-X logo or player avatar

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in info command:', error);
            await interaction.editReply({
                embeds: [errorEmbed('Error', 'An error occurred while fetching player information.')]
            });
        }
    }
};
