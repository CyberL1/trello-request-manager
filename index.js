const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { readdirSync } = require('fs');
const config = require("./config.json");

const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));

for (file of eventFiles) {
  const event = require(`./events/${file}`);
  const eventName = file.split('.js')[0];
  client.on(eventName, (...args) => event(client, ...args))
}

client.login(config.discord.client.token);
