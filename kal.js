const os = require('os');
const moment = require("moment");
const Discord = require("discord.js");
require("moment-duration-format");

exports.run = (database, client, message, args) => {
  let subcommand = args.shift();
  switch (subcommand) {
      case "setup":
        // run setup
        if (!message.member.hasPermission('ADMINISTRATOR')) {return}
        message.send("KalBot requires a few options set in order to work\n \
        What authentication system would you like to use?\n \
        ffxiv\n wow\n none\n \
        Reply with **!kal set auth *[ffxiv | wow | none]* \
        ");
      break;

      case "set":
        if (!message.member.hasPermission('ADMINISTRATOR')) {return}
        let option = args.shift();
        switch (option) {
          case "auth":
            let auth_mode;
            // make sure its a supported auth system
            if (args == "ffxiv") {
              auth_mode = 'ffxiv'
            } else if (args == "wow") {
              auth_mode = 'wow'
            } else if (args == "none") {
              auth_mode = 'none'
            } else {
              message.send("Invalid auth plugin selected");
              return
            }
           database.guilds.update({
             auth_mode: auth_mode
           }, {
             where: { guild_id: message.guild.id }
           }).then((r) => {
              message.channel.send(`Authentication mode set to **${auth_mode}**`);
              console.log(`[DEBUG] Authentication mode set to ${auth_mode} for guild ${message.guild.id}`);
           });
           break;
          
          case "defaultRole":
           let defaultRole = args.join(' ');
           database.guilds.update({
             defaultRole: defaultRole
           }, {
             where: { guild_id: message.guild.id }
           }).then((r) => {
             message.channel.send(`Authenticated users will be placed in **${defaultRole}**`);
             console.log(`[DEBUG] Default auth role set to ${defaultRole} for guild ${message.guild.id}`);
           });
           break;
          
          case "welcomeChannel":
           let welcomeChannel = args.shift();
           database.guilds.update({
             auth_channel: welcomeChannel
           }, {
             where: { guild_id: message.guild.id }
           }).then((r) => {
             message.channel.send(`Authentication Channel set to ${welcomeChannel}`);
             console.log(`[DEBUG] auth channel set to ${welcomeChannel} for guild ${message.guild.id}`);
           });
           break;

          case "announceChannel":
            let announceChannel = args.shift();
            database.guilds.update({
              announceChannel: announceChannel
            }, {
              where: { guild_id: message.guild.id }
            }).then((r) => {
              message.channel.send(`Event announcement channel set to ${announceChannel}`);
              console.log(`[DEBUG] announce channel set to ${announceChannel} for guild ${message.guild.id}`);
            });
            break;
        }
      break;
      
      case "stats":
        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
          message.channel.send({embed: {
          title: 'Bot Stats',
          description: 'KalBot v1.0',
          color: 14775573,
          fields: [
            {
              name: 'Hostname',
              value: os.hostname()
            },
            {
              name: 'Memory Usage',
              value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
            },
            {
              name: 'Uptime',
              value: moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]"),
            },
            {
              name: 'Users',
              value: client.users.size.toLocaleString(),
              inline: true
            },
            {
              name: 'Servers',
              value: client.guilds.size.toLocaleString(),
              inline: true
            },
            {
              name: 'Channels',
              value: client.channels.size.toLocaleString(),
              inline: true
            },
            {
              name: 'Discord.js',
              value: `v${Discord.version}`
            },
            {
              name: "Node",
              value: process.version,
              inline: true
            }
          ]
        }});
        break;

  }
}