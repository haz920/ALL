/*

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
                                                 
  _________ ___ ___ ._______   _________    
 /   _____//   |   \|   \   \ /   /  _  \   
 \_____  \/    ~    \   |\   Y   /  /_\  \  
 /        \    Y    /   | \     /    |    \ 
/_______  /\___|_  /|___|  \___/\____|__  / 
        \/       \/                     \/  
                    
DISCORD :  https://discord.com/invite/xQF9f9yUEM                   
YouTube : https://www.youtube.com/@GlaceYT                         

Command Verified : ✓  
Website        : ssrr.tech  
Test Passed    : ✓

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
*/

const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("📊 Show server statistics"),

  async execute(interaction, client) {
    const { guild } = interaction;

    // Count members in voice channels
    const voiceCount = guild.channels.cache
      .filter(c => c.type === ChannelType.GuildVoice)
      .reduce((acc, ch) => acc + ch.members.size, 0);

    const boosts = guild.premiumSubscriptionCount || 0;
    const boostTier = guild.premiumTier || 0;

    const embed = new EmbedBuilder()
      .setTitle(`⭐ ${guild.name} Stats`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setColor("#FFD700")
      .addFields(
        { name: "👥 Members", value: `${guild.memberCount.toLocaleString()}`, inline: true },
        { name: "🔊 Voice", value: `${voiceCount}`, inline: true },
        { name: "🚀 Boosts", value: `${boosts} (Level ${boostTier})`, inline: true }
      )
      .setFooter({ text: `Server Live Stats • ${new Date().toLocaleString()}` });

    await interaction.reply({ embeds: [embed] });
  }
};

/*

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
                                                 
  _________ ___ ___ ._______   _________    
 /   _____//   |   \|   \   \ /   /  _  \   
 \_____  \/    ~    \   |\   Y   /  /_\  \  
 /        \    Y    /   | \     /    |    \ 
/_______  /\___|_  /|___|  \___/\____|__  / 
        \/       \/                     \/  
                    
DISCORD :  https://discord.com/invite/xQF9f9yUEM                   
YouTube : https://www.youtube.com/@GlaceYT                         

Command Verified : ✓  
Website        : ssrr.tech  
Test Passed    : ✓

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆
*/