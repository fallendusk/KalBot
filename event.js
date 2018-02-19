const moment = require('moment');
const database = require('./database.js');
const Discord = require('discord.js');
const config = require('./auth_config.json');

const checkPermissions = (msg, args) => {
    // Check if they have one of many roles
    if(msg.member.roles.some(r=>config.adminRoles.includes(r.name)) ) {
        msg.channel.send("You have event creation permissions! " + msg.member.highestRole);
    } else {
        msg.channel.send("Permission denied for role " + msg.member.highestRole);
    }
};
const hasEventAdminPermission = (msg) => {
    // Check if they have one of many roles
    if(msg.member.roles.some(r=>config.adminRoles.includes(r.name)) ) {
        return true;
    } else {
        return false;
    }
};

const eventEmbed = (e) => {
    return { embed:{
        title: e.name,
        description: e.desc,
        color: 14775573,
        thumbnail: {
          url: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/calendar-512.png',
        },
        // footer: {
        //     text: `Signup for this event with !e attend ${e.id} in the #events channel`
        // },
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
    }};
};

const eventSendEmbed = (msg, e, m) => {
    if (typeof m === 'undefined') { m = ''; }
    msg.channel.send(m, eventEmbed(e)).catch(console.error);
};
const argumentHandler = (args) => {
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
    return eventargs;
};
const eventCreate = (msg, args) => {
    console.log("DEBUG: eventCreate function");

    // Check if member has event permissions
    if (!hasEventAdminPermission(msg)) {
        msg.channel.send('Event creation/modification is disabled for your role, ' + msg.member);
        return;
    }

    let eventargs = argumentHandler(args);
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

    if((eventargs.end-eventargs.start)<0) {
        msg.channel.send('Error: End date must occur after start date.');
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
            let announceChannel = msg.guild.channels.get(config.announceChannel);
            announceChannel.send('A new event has been announced!', eventEmbed(e)).catch(console.error);
            // send an announcement to the announcements channel

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
const eventDelete = async (msg, args) => {
    console.log("DEBUG: eventDelete function");
        // Check if member has event permissions
    if (!hasEventAdminPermission(msg)) {
        msg.channel.send('Event creation/modification is disabled for your role.');
        return;
    }

    let eventId = args.shift();
    if (isNaN(eventId)) {
        msg.channel.send('Missing or invalid event id');
        return;        
    }

    // Try to grab the specified event from the database
    let eventResult = await database.events.findById(eventId, {plain: true});
    if (!eventResult) {
        msg.channel.send("Couldn't find specified event, check your id and try again.");
        return;
    }

    eventResult.destroy().then(() => {
        msg.channel.send(`Event ${eventId} deleted.`);
    }).catch((err) => {
        console.log(`ERROR: ${err}`);
        msg.channel.send(`An error occured deleting the event. ${err}`);
    });
};
const eventModify = async (msg, args) => {
    console.log("DEBUG: eventModify function");

    // Check if member has event permissions
    if (!hasEventAdminPermission(msg)) {
        msg.channel.send('Event creation/modification is disabled for your role.');
        return;
    }

    let eventId = args.shift();
    if (isNaN(eventId)) {
        msg.channel.send('Missing or invalid event id');
        return;
    }

    // Try to grab the specified event from the database
    let eventResult = await database.events.findById(eventId, {plain: true});

    if (!eventResult) {
        msg.channel.send("Couldn't find specified event, check your id and try again.");
        return;
    }

    let eventargs = argumentHandler(args);
    console.log(`DEBUG: ${eventargs}`);

    // Check for valid input
    let validEvent = {};
    const validArgs = ['name', 'desc', 'location', 'start', 'end'];
    for (let a of validArgs) {
        if (eventargs[a] === undefined) {
            validEvent[a] = eventResult[a];
        } else {
            validEvent[a] = eventargs[a];
        }
    }

    // parse start and end time into moment
    if (eventargs.start) {
        validEvent.start = moment(validEvent.start);
    } else {
        validEvent.start = moment(eventResult.startDate);
    }

    if (eventargs.end) {
        validEvent.end = moment(validEvent.end);
    } else {
        validEvent.end = moment(eventResult.endDate);
    }

    if (!validEvent.start.isValid()) {
        msg.channel.send('Start date format is invalid, use MM-DD-YYYY HH:MM AM|PM');
        return;
    }
    if (!validEvent.end.isValid()) {
        msg.channel.send('End date format is invalid, use MM-DD-YYYY HH:MM AM|PM');
        return;
    }
    if((validEvent.end-validEvent.start)<0) {
        msg.channel.send('Error: End date must occur after start date.');
        return;
    }
    // Update the event in db
    database.sequelize.sync().then(() => {
        database.events.update({
            name: validEvent.name,
            desc: validEvent.desc,
            location: validEvent.location,
            startDate: validEvent.start.format(),
            endDate: validEvent.end.format(),
        }, {
            where: { id: eventId },
            returning: true,
            plain: true
        }).then((result) => {
            console.log("DEBUG: event updated");
            database.events.findById(eventId, {plain: true}).then((updatedEvent) => {
                eventSendEmbed(msg, updatedEvent, 'Event Updated!');
            });
            
        });
    });
};
const eventList = (msg, args) => {    
    console.log("DEBUG: eventList function");
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

    // otherwise grab next 10 events 
    const eventLimit = 10;
    database.sequelize.sync().then(() => {
        database.events.findAll
        ({
            where: {
                startDate: {
                    $gte: moment().toDate()
                }
            },
            order: [
                ['startDate', 'ASC'],
            ],
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
exports.cron = async (client) => {
    let query = "SELECT * FROM events WHERE startDate < datetime('now', '+15 Minute') AND endDate > datetime('now') AND announced = 0";
    let results = await database.sequelize.query(query, { type: database.sequelize.QueryTypes.SELECT });
    let announceChannel = client.channels.get(config.announceChannel);
    if (results.length > 0) {
        for (let r in results) {
            results[r].start = moment(results[r].startDate);
            results[r].end = moment(results[r].endDate);
            // Flag the event as announced to prevent duplicate announcements
            database.events.update({
                announced: true
            }, { where: { id: results[r].id}});
            announceChannel.send('<@everyone> An upcoming event starts in < 15 minutes!', eventEmbed(results[r])).catch(console.error);
        }
    }
};
exports.run = (client, message, args) => {
    let subcommand = args.shift();
    switch (subcommand) {
        case "checkperm":
            checkPermissions(message, args);
            break;
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
