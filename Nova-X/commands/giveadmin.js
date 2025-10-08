const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { success, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveadmin')
    .setDescription('give admin')
    .addStringOption(o => o.setName('username').setDescription('Account username or ID').setRequired(true))
    .addStringOption(o => o.setName('role').setDescription('admin/supporter').setRequired(true).addChoices(
      { name: 'admin', value: 'admin' },
      { name: 'supporter', value: 'supporter' }
    ))
    .addIntegerOption(o => o.setName('value').setDescription('Value').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const username = interaction.options.getString('username', true);
    const role = interaction.options.getString('role', true);
    const value = interaction.options.getInteger('value', true);
    try {
      const account = await db.giveAdmin(username, role, value);
      return interaction.editReply({ embeds: [success(`Granted ${role}(${value}) to ${account.username}`)] });
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [error(e.message || 'Failed to give admin')] });
    }
  }
};