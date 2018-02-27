const common = require('./common.js');
const moment = require('moment');

exports.eventCreate = (database, msg, args) => {
    console.log("DEBUG: eventCreate function");

    // Check if member has event permissions
    if (!common.hasEventAdminPermission(msg)) {
        msg.channel.send('Event creation/modification is disabled for your role, ' + msg.member);
        return;
    }

    let eventargs = common.argumentHandler(args);
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
    
    // Save the valid event to db
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
        common.eventSendEmbed(msg, e);
        
        //let announceChannel = msg.guild.channels.get(common.config.announceChannel);
        //announceChannel.send('A new event has been announced!', common.eventEmbed(e)).catch(console.error);
        // send an announcement to the announcements channel

    });
};