/*jshint esversion: 6 */
const Discord = require("discord.js");
const express = require('express');
const client = new Discord.Client();
const api = express();
const cors = require('cors');
const database = require('./database.js');
var prefix = "!";

// require command functions
const auth = require('./auth.js');
const kal = require('./kal.js');
const events = require('./events');

client.on("ready", async () => {
  console.log('KalBot connected.');
  client.user.setActivity('<3');

  // sync db tables
  await database.sequelize.sync();

  // Run tasks on ready then setup 5min cron timer
  events.cron(database, client);
  let cron = setInterval(() => {
    console.log("DEBUG: Executing cron tasks");
    events.cron(database, client);
  }, 300*1000);
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
    events.run(database, client, message, args);
  }
  
});

client.login(auth.token);

api.use(cors());
api.use(require('./api'));
api.listen(3000, () => {
  console.log('KalBot API listening on port 3000');
});