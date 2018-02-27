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

    for(let e in events) {
        events[e].start = new Date(events[e].start);
        events[e].end = new Date(events[e].end);
        events[e].allDay = false;
    }
    res.json(events);
});

module.exports = router