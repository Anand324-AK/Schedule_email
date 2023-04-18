const express = require("express");

const router = express.Router()
const emailController = require("../Controller/emailController")

//endpoint to list scheduled emails
router.get('/emails',emailController.getEmails)

//endpoint to schedule email
router.post("/scheduleemail",emailController.scheduleEmail)

//endpoint to list all unsent scheduled emails
router.get('/emails/unsent',emailController.getUnsentEmails)

//endpoint to update schedule emails
router.put('/updateemails/:id',emailController.updateScheduleEmail)

//endpoint to delete scheduled emails
router.delete("/deleteemails/:id",emailController.deleteScheduleEmail)

module.exports = router