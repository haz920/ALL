const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../db');
const { success, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removecharacter')
    .setDescription('remove Character')
    .addIntegerOption(o => o.setName('id').setDescription('Character ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const id = interaction.options.getInteger('id', true);
    try {
      const affected = await db.removeCharacter(id);
      if (affected > 0) return interaction.editReply({ embeds: [success(`Character ${id} removed.`)] });
      return interaction.editReply({ embeds: [error('Character not found.')] });
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [error('Failed to remove character')] });
    }
  }
};