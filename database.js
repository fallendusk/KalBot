const Sequelize = require('sequelize');
const sequelize = new Sequelize('null', 'null', 'null', {
    dialect: 'sqlite',
    storage: 'kalbot.db'
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.events = sequelize.define('event', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    desc: Sequelize.STRING,
    location: Sequelize.STRING,
    startDate: Sequelize.DATE,
    endDate: Sequelize.DATE,
    owner: Sequelize.STRING
});

module.exports = db;    