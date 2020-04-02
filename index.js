const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const Trello = require("trello");
const trello = new Trello(config.trello.appKey, config.trello.userToken);

client.on("message", message => {
  
  // Ignore all bots
  if (message.author.bot) return;
  
  if (message.channel.id == config.discord.channels.reqID) return trello.addCard(message.content, `Requested by ${message.author.tag} (${message.author.id})`, config.trello.lists.requests).then(async request => {
    message.author.send(`Your request has been posted on here: ${request.shortUrl}\n\nNote: The bot will DM you after reviewing your request`);
    let embed = new Discord.MessageEmbed().setColor('#0000ff')
    .setAuthor(client.user.tag, client.user.displayAvatarURL())
    .setDescription(`By ${message.author.tag}`)
    .addField('Description', message.content)
    .setFooter(request.shortLink);
    client.channels.cache.get(config.discord.channels.manageID).send(embed).then(async embed => {
      await embed.react(config.discord.emotes.accept);
      await embed.react(config.discord.emotes.decline);
      await embed.awaitReactions((reaction, user) => user.id == config.discord.client.ownerID && (reaction.emoji.name == config.discord.emotes.decline || reaction.emoji.name == config.discord.emotes.accept), { max: 1 }).then(async collected => {
        await embed.delete();
        if(collected.first().emoji.name == config.discord.emotes.accept) {
          await trello.updateCardList(embed.embeds[0].footer.text, config.trello.lists.accepted);
          await trello.addLabelToCard(embed.embeds[0].footer.text, config.trello.labels.accepted);
          await message.author.send(`Your request has been accepted and marked with accepted label: ${request.shortUrl}`);
        } else if(collected.first().emoji.name == config.discord.emotes.decline) {
          await trello.updateCardList(embed.embeds[0].footer.text, config.trello.lists.declined);
          await trello.addLabelToCard(embed.embeds[0].footer.text, config.trello.labels.declined);
          await message.author.send(`Your request has been declined: ${request.shortUrl}`);
        };
      });
    });
  });
});

client.on("ready", () => {
  console.log("ready");
  client.user.setActivity(`https://github.com/CyberLinx/trello-request-manager`, {type: "WATCHING"});
});

client.login(config.discord.client.token);
