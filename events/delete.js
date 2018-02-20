const common = require('./common.js');

exports.eventDelete = async (database, msg, args) => {
    console.log("DEBUG: eventDelete function");
    
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

    eventResult.destroy().then(() => {
        msg.channel.send(`Event ${eventId} deleted.`);
    }).catch((err) => {
        console.log(`ERROR: ${err}`);
        msg.channel.send(`An error occured deleting the event. ${err}`);
    });
};