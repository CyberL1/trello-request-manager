const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../config.json');
const Trello = require("trello");
const trello = new Trello(config.trello.appKey, config.trello.userToken);

module.exports = (client, message) => {
    if (message.author.bot) return;

    if (message.channel.id === config.discord.channels.reqID) trello.addCard(message.content, `Requested by ${message.author.tag} (${message.author.id})`, config.trello.lists.requests).then(request => {
        message.author.send(`Your request has been posted on here: ${request.shortUrl}\n\nNote: The bot will DM you after reviewing your request`);
        const embed = new MessageEmbed().setColor('#0000ff')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`${message.author.id}`)
        .addField('Description', message.content)
        .setFooter(request.shortLink);

        const buttons = new MessageActionRow().addComponents(
            new MessageButton()
            .setCustomId('accept-request')
            .setLabel('Accept')
            .setStyle('SUCCESS')
            .setEmoji(config.discord.emotes.accept)
        ).addComponents(
            new MessageButton('deny-request')
            .setCustomId('deny-request')
            .setLabel('Deny')
            .setStyle('DANGER')
            .setEmoji(config.discord.emotes.decline)
        )
        message.guild.channels.cache.get(config.discord.channels.manageID).send({embeds: [embed], components: [buttons]});
    });
}