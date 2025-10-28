const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { success, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('givemoney')
    .setDescription('Give Money')
    .addStringOption(o => o.setName('username').setDescription('Account username or ID').setRequired(true))
    .addIntegerOption(o => o.setName('amount').setDescription('Amount to add').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const username = interaction.options.getString('username', true);
    const amount = interaction.options.getInteger('amount', true);
    try {
      await db.adjustMoney(username, amount);
      return interaction.editReply({ embeds: [success(`Added ${amount} money to ${username}`)] });
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [error(e.message || 'Failed to give money')] });
    }
  }
};