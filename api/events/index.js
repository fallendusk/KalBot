var express = require('express')
  , router = express.Router()
const db = require('../../database.js');

router.get('/', async (req, res) => {
    let events = await db.events.findAll({
        attributes: [
            'id',
            ['name', 'title'], 
            'desc',
            ['startDate', 'start'],
            ['endDate', 'end']
        ],
        raw: true
    });
    res.json(events);
});

module.exports = router