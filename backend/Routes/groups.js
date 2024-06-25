const router = require('express').Router()
import groupControl from "../controllers/group.js";

router.post("/creategroup",groupControl.creategroup)
router.post("/joingroup",groupControl.joingroup)
router.put("/addfriendsgroup/:id",groupControl.addFriendsToGroup)
router.get("/getgroups/:id",groupControl.getgroups)
router.get("/getgroup/:id",groupControl.getgroup)
router.get("/getmembers/:id",groupControl.getmembers)
router.post("/splitbill",groupControl.splitBill)
router.put("/markpaid/:id",groupControl.markPaid)
router.put("/markapproved/:id",groupControl.markApproved)
router.post("/simplifyDebt/:id",groupControl.simplifyDebt)
router.post("/approveDebt/:id",groupControl.approveDebt)
router.get("/getDebts/:groupId",groupControl.getDebts)
router.delete("/deleteGroup/:id",groupControl.deleteGroup)
router.post("/addcomment",groupControl.addComment)
router.get("/getcomments/:id",groupControl.getAllComments)


module.exports = router