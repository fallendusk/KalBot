/*jshint esversion: 6 */
const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require('./auth.json');
var prefix = "!";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

client.on("ready", () => {
  console.log('KalBot connected.');
  client.user.setGame('<3');
});

client.on("guildMemberAdd", member => {
  let channel = client.channels.get(auth.channel);
  channel.send(`Welcome <@${member.user.id}>! Please set your in-game character with !iam ${auth.ffxivServerName} firstname lastname`).catch(console.error);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'kal') {
    let subcommand = args[0];
    if (subcommand === 'execute66') {
      message.channel.send('Executing order 66...');
    }
  }

  if (command === 'iam') {
    let [serverName, characterFirstName, characterLastName] = args;
    if (!serverName || !characterFirstName || !characterLastName) {
      if (auth.debugMode) console.log('Missing argument');
      message.channel.send(`Missing argument. Please use !iam ${auth.ffxivServerName} firstname lastname`);
      return;
    }

    let characterName = `${capitalizeFirstLetter(characterFirstName)} ${capitalizeFirstLetter(characterLastName)}`;
    let role = message.guild.roles.find("name", auth.defaultRole);

    if (auth.debugMode) {
      console.log(`${message.author.username} has chosen the Character: ${characterName}`);
      console.log(`Role for ${message.author.username} is found to be ${role}`);
      console.log('Begin Nickname Change');
    }

    message.member.setNickname(characterName).catch(console.error);

    if (auth.debugMode) console.log("Finish Nickname Change\r\nBegin Role Change");

    setTimeout(function() { console.log(`${message.author.username} has verified their account.`); }, 250);
    message.member.addRole(role).catch(console.error);
    
    message.channel.send(`<@${message.author.id}> authenticated as **${characterName}**`);

    if (auth.debugMode)
      console.log('Finish Role Change');
    }
});

client.login(auth.token);
