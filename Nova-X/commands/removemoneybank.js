const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { success, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removemoneybank')
    .setDescription('remove Money Bank')
    .addStringOption(o => o.setName('username').setDescription('Account username or ID').setRequired(true))
    .addIntegerOption(o => o.setName('amount').setDescription('Amount to remove').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const username = interaction.options.getString('username', true);
    const amount = interaction.options.getInteger('amount', true);
    try {
      await db.adjustBankMoney(username, -Math.abs(amount));
      return interaction.editReply({ embeds: [success(`Removed ${amount} bank money from ${username}`)] });
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [error(e.message || 'Failed to remove bank money')] });
    }
  }
};