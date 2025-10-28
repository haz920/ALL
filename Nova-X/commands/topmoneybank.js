const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');
const { info, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('topmoneybank')
    .setDescription('Top Money Bank')
    .addIntegerOption(o => o.setName('limit').setDescription('How many').setMinValue(1).setMaxValue(20)),
  async execute(interaction) {
    await interaction.deferReply();
    const limit = interaction.options.getInteger('limit') ?? 10;
    try {
      const rows = await db.getTopMoneyBank(limit);
      const lines = rows.map((r, i) => `#${i+1} ${r.username} — ${r.total_bank}`);
      return interaction.editReply({ embeds: [info('Top Money Bank', lines.join('\n') || 'No data')] });
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [error('Failed to fetch bank rankings')] });
    }
  }
};