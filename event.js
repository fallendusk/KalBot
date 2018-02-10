const moment = require('moment');

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

    // Check for valid input
    let argumentErrors = [];
    const requiredArgs = ['name', 'desc', 'location', 'start', 'end'];
    for (let a of requiredArgs) {
        if (eventargs[a] === undefined) {
            argumentErrors.push(`--${a}`);
        }
    }
    if (argumentErrors.length > 0) {
        msg.channel.send(`Missing argument(s): ${argumentErrors.join(', ')}`);
        return;
    }
    eventargs.start = moment(eventargs.start);
    eventargs.end = moment(eventargs.end);

    if (!eventargs.start.isValid()) {
        msg.channel.send('Start date format is invalid, use MM-DD-YYYY HH:MM AM|PM');
        return;
    }
    if (!eventargs.end.isValid()) {
        msg.channel.send('End date format is invalid, use MM-DD-YYYY HH:MM AM|PM');
        return;
    }

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
              value: `${eventargs.start.format('MMM D, YYYY h:mmA')} (UTC${eventargs.start.format('ZZ')})`,
              //value: eventargs.start,
            },
            {
              name: 'Event End',
              value: `${eventargs.end.format('MMM D, YYYY h:mmA')} (UTC${eventargs.end.format('ZZ')})`,
              //value: eventargs.end,
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
