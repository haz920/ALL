const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');
const { info, error } = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Show full info about a player account')
    .addStringOption(o => o.setName('username_or_id').setDescription('Account username or ID').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const identifier = interaction.options.getString('username_or_id', true);
    try {
      const account = await db.getAccountByUsernameOrId(identifier);
      if (!account) {
        return interaction.editReply({ embeds: [error('Account not found')] });
      }
      const characters = await db.getCharactersByAccount(account.id);
      const totalMoney = characters.reduce((s, c) => s + Number(c.money), 0);
      const totalBank = characters.reduce((s, c) => s + Number(c.bank_money), 0);
      const embed = info('Account Info', `Username: ${account.username}\nID: ${account.id}\nSerial: ${account.serial ?? 'N/A'}\nCharacters: ${characters.length}\nTotal Money: ${totalMoney}\nTotal Bank: ${totalBank}`);
      return interaction.editReply({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      return interaction.editReply({ embeds: [error('Failed to fetch account info')] });
    }
  }
};