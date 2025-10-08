const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

/**
 * Create a standardized embed with Nova-X branding
 */
function createEmbed(options = {}) {
    const embed = new EmbedBuilder()
        .setColor(options.color || config.colors.primary)
        .setTimestamp();

    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);
    if (options.footer) embed.setFooter({ text: options.footer });
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);
    if (options.author) embed.setAuthor(options.author);
    if (options.fields) embed.addFields(options.fields);

    return embed;
}

/**
 * Create a success embed
 */
function successEmbed(title, description) {
    return createEmbed({
        color: config.colors.success,
        title: `✅ ${title}`,
        description: description,
        footer: 'Nova-X MTA System'
    });
}

/**
 * Create an error embed
 */
function errorEmbed(title, description) {
    return createEmbed({
        color: config.colors.error,
        title: `❌ ${title}`,
        description: description,
        footer: 'Nova-X MTA System'
    });
}

/**
 * Create a warning embed
 */
function warningEmbed(title, description) {
    return createEmbed({
        color: config.colors.warning,
        title: `⚠️ ${title}`,
        description: description,
        footer: 'Nova-X MTA System'
    });
}

/**
 * Create an info embed
 */
function infoEmbed(title, description, fields = []) {
    return createEmbed({
        color: config.colors.info,
        title: `ℹ️ ${title}`,
        description: description,
        fields: fields,
        footer: 'Nova-X MTA System'
    });
}

/**
 * Format money with currency symbol
 */
function formatMoney(amount) {
    return `$${amount.toLocaleString('en-US')}`;
}

/**
 * Format date/time
 */
function formatDate(date) {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

module.exports = {
    createEmbed,
    successEmbed,
    errorEmbed,
    warningEmbed,
    infoEmbed,
    formatMoney,
    formatDate
};
