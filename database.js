const Sequelize = require('sequelize');
const sequelize = new Sequelize('null', 'null', 'null', {
    dialect: 'sqlite',
    storage: 'kalbot.db'
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.guilds = sequelize.define('guild', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    guild_id: {
        type: Sequelize.INTEGER,
        unique: true
    },
    auth_channel: Sequelize.STRING,
    auth_mode: Sequelize.STRING,
    defaultRole: Sequelize.STRING,
    announceChannel: Sequelize.STRING,
    adminRoles: Sequelize.STRING,
    serverName: Sequelize.STRING
});

db.events = sequelize.define('event', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    guild_id: {
        type: Sequelize.INTEGER,
        unique: true
    },
    name: Sequelize.STRING,
    desc: Sequelize.STRING,
    location: Sequelize.STRING,
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    owner: Sequelize.STRING,
    announced: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

module.exports = db;                          