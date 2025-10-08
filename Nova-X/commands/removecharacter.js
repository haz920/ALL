const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { success, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removecharacter')
    .setDescription('remove Character .')
    .addIntegerOption(o => o.setName('id').setDescription('Character ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const id = interaction.options.getInteger('id', true);
    try {
      const affected = await db.removeCharacter(id);
      await interaction.reply({ embeds: [success(`Removed ${affected} character(s) with id ${id}.`)] });
    } catch (e) {
      console.error(e);
      await interaction.reply({ embeds: [error('Failed to remove character.')], ephemeral: true });
    }
  }
};