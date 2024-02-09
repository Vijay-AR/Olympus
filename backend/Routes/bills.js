const router = require('express').Router();
const billControl = require('../Controllers/bill')

router.post('/addBill', billControl.add)
router.get('/getBill:userId' , billControl.get)
router.put('/editBill:id', billControl.edit)
router.delete('/deleteBill:id', billControl.del)

module.exports = router;
