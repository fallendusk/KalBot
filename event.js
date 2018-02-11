const moment = require('moment');
const database = require('./database.js');
const Discord = require('discord.js');

const eventSendEmbed = (msg, e) => {
    msg.channel.send({embed:
        {
          title: e.name,
          description: e.desc,
          color: 14775573,
          thumbnail: {
            url: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png',
          },
          footer: {
              text: `Signup for this event with !e attend ${e.id} in the #events channel`
          },
          fields: [
            {
              name: 'Location',
              value: e.location,
            },
            {
              name: 'Event Start',
              value: `${moment(e.startDate).format('MMM D, YYYY h:mmA')} (UTC${moment(e.startDate).format('ZZ')})`,
              //value: eventargs.start,
            },
            {
              name: 'Event End',
              value: `${moment(e.endDate).format('MMM D, YYYY h:mmA')} (UTC${moment(e.endDate).format('ZZ')})`,
              //value: eventargs.end,
            },
            {
                name: 'Event Id',
                value: e.id
            },
          ],
        },
        }).catch(console.error);
};
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
    
    //eventargs.id = 42; // example only
    // Save the valid event to db
    database.sequelize.sync().then(() => {
        database.events.create({
            name: eventargs.name,
            desc: eventargs.desc,
            location: eventargs.location,
            startDate: eventargs.start.format(),
            endDate: eventargs.end.format(),
            owner: `${msg.member}`
        }).then((result) => {
            console.log("DEBUG: event saved");
            const e = result.get({plain:true});
            eventSendEmbed(msg, e);
        });
    });
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

    // if event id was passed with command, list only that event
    let eventId = args.shift();
    if (!isNaN(eventId))
    {
        database.sequelize.sync().then(() =>{
            database.events.find({
                where: {
                    id: eventId,
                },
                limit: 1,
                raw: true 
            }).then((result) => {
                eventSendEmbed(msg, result);
            }).catch((err) => {
                console.log("ERROR: " + err);
            });
        });
        return;
    };

    // otherwise grab next 5 events 
    const eventLimit = 5;
    database.sequelize.sync().then(() => {
        database.events.findAll
        ({
            where: {
                startDate: {
                    $gte: moment().toDate()
                }
            },
            limit: eventLimit,
            raw: true
        }).then((result) => {
            let eventList = result;
            console.log("DEBUG: "+ eventList);
            let embedFields = [];

            for (let e of eventList) {
                embedFields.push({name:`${e.id}: ${e.name} (${moment(e.startDate).format("MMM D, YYYY h:mmA")})`, value: e.desc});
            }

            msg.channel.send({embed: {
                title: 'Upcoming Events',
                color: 14775573,
                thumbnail: {
                    url: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png',
                  },
                fields: embedFields,
                footer: {
                    text: 'Type !e list <id> in the #events channel to view full event details'
                }
            }});

        }).catch((err) => {
            console.log("ERROR: " + err);
        })
    });
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
