const config = require('../config.json');
const Trello = require("trello");
const trello = new Trello(config.trello.appKey, config.trello.userToken);

module.exports = (client, interaction) => {
  if (!interaction.member.roles.cache.has(config.discord.client.managerRole)) return interaction.reply({content: 'You cannot manage trello requests', ephemeral: true});
  const embed = interaction.message.embeds[0];
  
  if (interaction.customId === 'accept-request') {
    trello.updateCardList(embed.footer.text, config.trello.lists.accepted);
    if (config.trello.labels.enabled) trello.addLabelToCard(embed.footer.text, config.trello.labels.accepted);
    interaction.guild.members.cache.get(embed.description).send(`Your request has been accepted and marked with accepted label: https://trello.com/c/${embed.footer.text}`);
  } else if (interaction.customId === 'deny-request') {
    trello.updateCardList(embed.footer.text, config.trello.lists.declined);
    if (config.trello.labels.enabled) trello.addLabelToCard(embed.footer.text, config.trello.labels.declined);
    interaction.guild.members.cache.get(embed.description).send(`Your request has been declined: https://trello.com/c/${embed.footer.text}`);
  };
  interaction.message.delete();
}