const router =require('express').Router();
const trans = require('../Controllers/trans');


router.post('/addTransaction', trans.addTrans)
router.get('/getTransaction:userId', trans.getTrans)
router.put('/editTransaction:id', trans.editTrans)
router.delete('/deleteTransaction/:id', trans.deleteTrans)





module.exports = router