const common = require('./common.js');
const moment = require('moment');

exports.eventModify = async (database, msg, args) => {
    console.log("DEBUG: eventModify function");

    // Check if member has event permissions
    if (!common.hasEventAdminPermission(msg)) {
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

    let eventargs = common.argumentHandler(args);
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
            common.eventSendEmbed(msg, updatedEvent, 'Event Updated!');
        });
    });
};