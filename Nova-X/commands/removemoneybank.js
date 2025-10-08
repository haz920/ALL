const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { success, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removemoneybank')
    .setDescription('remove Money Bank .')
    .addStringOption(o => o.setName('username').setDescription('Username or ID').setRequired(true))
    .addIntegerOption(o => o.setName('amount').setDescription('Amount').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const username = interaction.options.getString('username', true);
    const amount = interaction.options.getInteger('amount', true);
    try {
      const account = await db.adjustBankMoney(username, -Math.abs(amount));
      await interaction.reply({ embeds: [success(`Removed ${amount.toLocaleString()} bank money from ${account.username}.`)] });
    } catch (e) {
      console.error(e);
      await interaction.reply({ embeds: [error('Failed to remove bank money.')], ephemeral: true });
    }
  }
};