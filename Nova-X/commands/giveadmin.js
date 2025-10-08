const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveadmin')
        .setDescription('Give admin permissions to a player')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username to give admin')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('adminlevel')
                .setDescription('Admin/Supporter level (1-9)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(9)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const username = interaction.options.getString('username');
        const adminLevel = interaction.options.getInteger('adminlevel');

        try {
            await interaction.deferReply();

            const result = await db.giveAdmin(username, adminLevel);

            if (result.affectedRows === 0) {
                return interaction.editReply({
                    embeds: [errorEmbed('User Not Found', `No user found with username: **${username}**`)]
                });
            }

            const levelName = getLevelName(adminLevel);
            const embed = successEmbed(
                'Admin Given',
                `**Username:** ${username}\n` +
                `**Level:** ${levelName} (${adminLevel})\n` +
                `**Given by:** ${interaction.user.tag}`
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in giveadmin command:', error);
            await interaction.editReply({
                embeds: [errorEmbed('Error', 'An error occurred while giving admin permissions.')]
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
