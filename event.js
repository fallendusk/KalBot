const eventCreate = (msg, args) => {
    console.log("DEBUG: eventCreate function");
    msg.channel.send("DEBUG: eventCreate function");
    
    const regex = / *(?:-+([^= \'\"]+)[= ]?)?(?:([\'\"])([^\2]+?)\2|([^- \"\']+))?/g;
    let m;
    let eventargs = {};

    while ((m = regex.exec(args.join(' '))) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match, groupIndex) => {
            console.log(`Found match, group ${groupIndex}: ${match}`);
            //msg.channel.send(`DEBUG: Found match, group ${groupIndex}: ${match}`);
        });

        eventargs[m[1]] = m[3];
    }

    console.log(`DEBUG: ${eventargs}`);
    msg.channel.send({embed:
        {
          title: eventargs.name,
          description: eventargs.desc,
          color: 14775573,
          thumbnail: {
            url: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png',
          },
          fields: [
            {
              name: 'Location',
              value: eventargs.location,
            },
            {
              name: 'Event Start',
              //value: `${startDate.format('MMM D, YYYY h:mmA')} (UTC${startDate.format('ZZ')})`,
              value: eventargs.start,
            },
            {
              name: 'Event End',
              //value: `${endDate.format('MMM D, YYYY h:mmA')} (UTC${endDate.format('ZZ')})`,
              value: eventargs.end,
            },
          ],
        },
        }).catch(console.error);
};
const eventAttend = (msg, args) => {
    console.log("DEBUG: eventAttend function");
    msg.channel.send("DEBUG: eventAttend function");
};
const eventCancel = (msg, args) => {
    console.log("DEBUG: eventCancel function");
    msg.channel.send("DEBUG: eventCancel function");
};
const eventDelete = (msg, args) => {
    console.log("DEBUG: eventDelete function");
    msg.channel.send("DEBUG: eventDelete function");
};
const eventModify = (msg, args) => {
    console.log("DEBUG: eventModify function");
    msg.channel.send("DEBUG: eventModify function");
};
const eventList = (msg, args) => {    
    console.log("DEBUG: eventList function");
    msg.channel.send("DEBUG: eventList function");
};

exports.run = (client, message, args) => {
    let subcommand = args.shift();
    switch (subcommand) {
        case "create" :
             eventCreate(message, args);
             break;
        case "attend" :
            eventAttend(message, args);
            break;
        case "cancel" :
            eventCancel(message, args);
            break;
        case "delete" :
            eventDelete(message, args);
            break;
        case "modify" :
            eventModify(message, args);
            break;
        case "list" :
            eventList(message, args);
            break;
    }
}
