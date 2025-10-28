const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { success, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banserial')
    .setDescription('Ban a serial with a reason')
    .addStringOption(o => o.setName('serial').setDescription('Serial to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const serial = interaction.options.getString('serial', true);
    const reason = interaction.options.getString('reason', true);
    try {
      await db.banSerial(serial, reason, interaction.user.tag);
      return interaction.editReply({ embeds: [success(`Banned serial ${serial} for: ${reason}`)] });
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [error('Failed to ban serial')] });
    }
  }
};