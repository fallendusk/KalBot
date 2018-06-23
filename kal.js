const os = require('os');
const moment = require("moment");
const Discord = require("discord.js");
require("moment-duration-format");

exports.run = (client, message, args) => {
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
              message.send(`Authentication mode set to **${auth_mode}**`);
           });
           break;
          
          case "defaultRole":
        }
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