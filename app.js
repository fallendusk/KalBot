/*jshint esversion: 6 */
const Discord = require("discord.js");
const client = new Discord.Client();
var prefix = "!";

// require command functions
const auth = require('./auth.js');
const kal = require('./kal.js');
const events = require('./event.js');

client.on("ready", () => {
  console.log('KalBot connected.');
  client.user.setGame('<3');
});

client.on("guildMemberAdd", member => {
  auth.guildMemberAdd(client, member);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'kal') {
    kal.run(client, message, args);
  }

  if (command === 'iam') {
    auth.run(client, message, args);
  }

  if (command === 'e') {
    events.run(client, message, args);
  }
  
});

client.login(auth.token);
