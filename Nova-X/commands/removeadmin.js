const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { success, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeadmin')
    .setDescription('remove admin')
    .addStringOption(o => o.setName('username').setDescription('Account username or ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const username = interaction.options.getString('username', true);
    try {
      const res = await db.removeAdmin(username);
      if (res.affected > 0) return interaction.editReply({ embeds: [success(`Removed admin for ${res.account.username}`)] });
      return interaction.editReply({ embeds: [error('Admin not found for that user')] });
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [error(e.message || 'Failed to remove admin')] });
    }
  }
};