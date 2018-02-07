
const config = require('./auth_config.json');

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.token = config.token;

exports.guildMemberAdd = (client, member) => {
    let channel = client.channels.get(config.channel);
    channel.send(`Welcome <@${member.user.id}>! Please set your in-game character with !iam ${config.ffxivServerName} firstname lastname`).catch(console.error);
}

exports.run = (client, message, args) => {
    let [serverName, characterFirstName, characterLastName] = args;
    if (!serverName || !characterFirstName || !characterLastName) {
    if (config.debugMode) console.log('Missing argument');
    message.channel.send(`Missing argument. Please use !iam ${config.ffxivServerName} firstname lastname`);
    return;
    }

    let characterName = `${capitalizeFirstLetter(characterFirstName)} ${capitalizeFirstLetter(characterLastName)}`;
    let role = message.guild.roles.find("name", config.defaultRole);

    if (config.debugMode) {
    console.log(`${message.author.username} has chosen the Character: ${characterName}`);
    console.log(`Role for ${message.author.username} is found to be ${role}`);
    console.log('Begin Nickname Change');
    }

    message.member.setNickname(characterName).catch(console.error);

    if (config.debugMode) console.log("Finish Nickname Change\r\nBegin Role Change");

    setTimeout(() => { 
    console.log(`${message.author.username} has verified their account.`);
    message.member.addRole(role).catch(console.error);
    }, 5000);

    message.channel.send(`<@${message.author.id}> authenticated as **${characterName}**`);

    if (config.debugMode)
    console.log('Finish Role Change');
}
