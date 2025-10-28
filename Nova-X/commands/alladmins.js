const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');
const { info, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alladmins')
    .setDescription('All Admins & Supporters'),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const rows = await db.getAllAdmins();
      if (rows.length === 0) return interaction.editReply({ embeds: [info('Admins', 'None')] });
      const lines = rows.map(r => `${r.username} — ${r.role} (${r.value})`);
      return interaction.editReply({ embeds: [info('Admins', lines.join('\n'))] });
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [error('Failed to fetch admins')] });
    }
  }
};