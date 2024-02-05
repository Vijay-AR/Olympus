const router = require('express').Router();
const friends = require('../Controllers/friends');


router.put('/sendRequest/:userId', friends.sentRequest)
router.put('/acceptRequest/:userId', friends.acceptRequest)

module.exports = router