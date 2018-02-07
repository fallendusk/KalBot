exports.run = (client, message, args) => {
    let subcommand = args[0];
    if (subcommand === 'execute66') {
      message.channel.send('Executing order 66...');
    }
}