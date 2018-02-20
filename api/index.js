var express = require('express')
  , router = express.Router()

router.use('/events', require('./events'));

module.exports = router