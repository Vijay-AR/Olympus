const router = require('express').Router()
const profile = require('../Controllers/profile')


router.put('/addImg:id', profile.profileImage)
router.get('/getInbox:userId',profile.getInbox)
router.post('/addBadge:id', profile.addBadges)
router.get('/getBadges:id', profile.getBadges)


module.exports = router