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

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("📊 Show server statistics"),

    async execute(interaction, client) {
        await interaction.deferReply();
        
        const { guild } = interaction;

        if (!guild) {
            return interaction.editReply({ content: "❌ This command can only be used in a server!" });
        }

        const voiceCount = guild.channels.cache
            .filter(c => c.type === 2)
            .reduce((acc, ch) => acc + ch.members.size, 0);

        const boosts = guild.premiumSubscriptionCount;
        const boostTier = guild.premiumTier;

        const embed = new EmbedBuilder()
            .setTitle(`⭐ ${guild.name} Stats`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor("#FFD700")
            .addFields(
                { name: "<:13th_Members:1423958806525771868> Members", value: `${guild.memberCount.toLocaleString()}`, inline: true },
                { name: "<a:13thmoon_voice:1423959205127258163> Voice", value: `${voiceCount}`, inline: true },
                { name: "<a:13th_Server_Boost:1423959286291365890> Boosts", value: `${boosts} (Level ${boostTier})`, inline: true }
            )
            .setFooter({ text: `Server Live Stats • ${new Date().toLocaleString()}` });

        await interaction.editReply({ embeds: [embed] });
    }
};