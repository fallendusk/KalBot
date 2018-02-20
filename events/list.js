const common = require('./common.js');
const moment = require('moment');

exports.eventList = (database, msg, args) => {    
    console.log("DEBUG: eventList function");

    // if event id was passed with command, list only that event
    let eventId = args.shift();
    if (!isNaN(eventId))
    {
        database.events.find({
            where: {
                id: eventId,
            },
            limit: 1,
            raw: true 
        }).then((result) => {
            common.eventSendEmbed(msg, result);
        }).catch((err) => {
            console.log("ERROR: " + err);
        });
    return;
    };

    // otherwise grab next 10 events 
    const eventLimit = 10;
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
    });
};