const router = require('express').Router()
const savFunc = require('../Controllers/savings')

router.post('/addSaving', savFunc.add)
router.get('/getSaving:userId' , savFunc.get)
router.put('/editSaving:id', savFunc.edit)
router.delete('/deleteSaving:id', savFunc.del)

module.exports = router;