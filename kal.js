const os = require('os');
const moment = require("moment");
const Discord = require("discord.js");
require("moment-duration-format");

exports.run = (client, message, args) => {
    let subcommand = args[0];
    if (subcommand === 'execute66') {
      message.channel.send('Executing order 66...');
    }
    if (subcommand === 'stats') {
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

    }
}