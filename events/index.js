const moment = require('moment');
const common = require('./common.js');
const config = common.config;
const eventCreate = require('./create.js').eventCreate;
const eventDelete = require('./delete.js').eventDelete;
const eventModify = require('./modify.js').eventModify;
const eventList = require('./list.js').eventList;

const checkPermissions = (msg, args) => {
    // Check if they have one of many roles
    if(msg.member.roles.some(r=>config.adminRoles.includes(r.name)) ) {
        msg.channel.send("You have event creation permissions! " + msg.member.highestRole);
    } else {
        msg.channel.send("Permission denied for role " + msg.member.highestRole);
    }
};

const eventAttend = (msg, args) => {
    console.log("DEBUG: eventAttend function");
    msg.channel.send("DEBUG: eventAttend function");
};
const eventCancel = (msg, args) => {
    console.log("DEBUG: eventCancel function");
    msg.channel.send("DEBUG: eventCancel function");
};


exports.cron = async (database, client) => {
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

exports.run = (database, client, message, args) => {
    let subcommand = args.shift();
    switch (subcommand) {
        case "checkperm":
            checkPermissions(message, args);
            break;
        case "create" :
            eventCreate(database, message, args);
            break;
        case "attend" :
            eventAttend(message, args);
            break;
        case "cancel" :
            eventCancel(message, args);
            break;
        case "delete" :
            eventDelete(database, message, args);
            break;
        case "modify" :
            eventModify(database, message, args);
            break;
        case "list" :
            eventList(database, message, args);
            break;
    }
}
