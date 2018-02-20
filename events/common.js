const moment = require('moment');
const config = require('../auth_config.json');

exports.config = config;

exports.hasEventAdminPermission = (msg) => {
    // Check if they have one of many roles
    if(msg.member.roles.some(r=>config.adminRoles.includes(r.name)) ) {
        return true;
    } else {
        return false;
    }
};

exports.eventEmbed = (e) => {
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

exports.eventSendEmbed = (msg, e, m) => {
    if (typeof m === 'undefined') { m = ''; }
    msg.channel.send(m, exports.eventEmbed(e)).catch(console.error);
};

exports.argumentHandler = (args) => {
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