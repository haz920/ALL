const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');
const { infoEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alladmins')
        .setDescription('All Admins & Supporters list'),
    
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const admins = await db.getAllAdmins();

            if (!admins || admins.length === 0) {
                return interaction.editReply({
                    embeds: [infoEmbed('Admin List', 'No admins or supporters found.')]
                });
            }

            // Group admins by level
            const adminsByLevel = {};
            admins.forEach(admin => {
                const level = admin.admin_level;
                if (!adminsByLevel[level]) {
                    adminsByLevel[level] = [];
                }
                adminsByLevel[level].push(admin.username);
            });

            // Create formatted list
            const adminList = Object.keys(adminsByLevel)
                .sort((a, b) => b - a) // Sort by level descending
                .map(level => {
                    const levelName = getLevelName(parseInt(level));
                    const users = adminsByLevel[level].join(', ');
                    return `**${levelName} (Level ${level}):**\n${users}`;
                }).join('\n\n');

            const embed = infoEmbed(
                '👮 All Admins & Supporters',
                `Total: ${admins.length}\n\n${adminList}`
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in alladmins command:', error);
            await interaction.editReply({
                embeds: [errorEmbed('Error', 'An error occurred while fetching the admin list.')]
            });
        }
    }
};

function getLevelName(level) {
    const levels = {
        9: '👑 Owner',
        8: '⭐ Head Admin',
        7: '🔴 Senior Admin',
        6: '🟠 Admin',
        5: '🟡 Moderator',
        4: '🟢 Trial Moderator',
        3: '🔵 Senior Supporter',
        2: '🟣 Supporter',
        1: '⚪ Trial Supporter'
    };
    return levels[level] || `Level ${level}`;
}
