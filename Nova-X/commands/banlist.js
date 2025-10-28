const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');
const { info, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banlist')
    .setDescription('Show serial bans')
    .addIntegerOption(o => o.setName('limit').setDescription('How many to show').setMinValue(1).setMaxValue(50)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const limit = interaction.options.getInteger('limit') ?? 10;
    try {
      const rows = await db.getBanList(limit);
      if (rows.length === 0) return interaction.editReply({ embeds: [info('Banlist', 'No bans found.')] });
      const lines = rows.map(r => `• ${r.serial ?? 'account:'+r.account_id} — ${r.reason}`);
      return interaction.editReply({ embeds: [info('Banlist', lines.join('\n'))] });
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [error('Failed to retrieve banlist')] });
    }
  }
};