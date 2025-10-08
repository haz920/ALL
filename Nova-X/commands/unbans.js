const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { success, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unbans')
    .setDescription('Unban a player by serial or account ID')
    .addStringOption(o => o.setName('serial_or_accountid').setDescription('Serial string or account ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const ident = interaction.options.getString('serial_or_accountid', true);
    try {
      const affected = await db.unbanBySerialOrAccount(ident);
      if (affected > 0) return interaction.editReply({ embeds: [success('Unbanned successfully.')] });
      return interaction.editReply({ embeds: [error('No matching bans found.')] });
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [error('Failed to unban')] });
    }
  }
};