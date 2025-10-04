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
const lang = require('../../events/loadLanguage');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("📊 Show server statistics"),

  async execute(interaction, client) {
    if (interaction.isCommand && interaction.isCommand()) {
      const { guild } = interaction;

      // Count members in voice channels
      const voiceCount = guild.channels.cache
        .filter(c => c.type === ChannelType.GuildVoice)
        .reduce((acc, ch) => acc + ch.members.size, 0);

      const boosts = guild.premiumSubscriptionCount || 0;
      const boostTier = guild.premiumTier || 0;

      const embed = new EmbedBuilder()
        .setTitle(`⭐ ${guild.name} 📊 Stats`)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setColor("#FFD700")
        .addFields(
          { name: "<:13th_Members:1423958806525771868> Members", value: `\`${guild.memberCount.toLocaleString()}\``, inline: true },
          { name: "<a:13thmoon_voice:1423959205127258163> Voice", value: `\`${voiceCount}\``, inline: true },
          { name: "<a:13th_Server_Boost:1423959286291365890> Boosts", value: `\`${boosts} (Level ${boostTier})\``, inline: true }
        )
        .setFooter({ text: `Server Live Stats • ${new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}` });

      await interaction.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
          name: "Alert!", 
          iconURL: cmdIcons.dotIcon,
          url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/stats`')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
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
