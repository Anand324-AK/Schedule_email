const Emails = require("../Models/email");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");

exports.getEmails = async (req, res, next) => {
  try {
    const emails = await Emails.find({ status: "scheduled" });
    res
      .status(200)
      .json({ message: "Fetched all scheduled Emails", email: emails });
  } catch (err) {
    res.status(500).json({ error: "Failed to list scheduled emails" });
  }
};

exports.scheduleEmail = async (req, res, next) => {
  try {
    const recipient = req.body.recipient;
    const subject = req.body.subject;
    const body = req.body.body;
    const scheduledTime = new Date(req.body.scheduledTime);
    const email = new Emails({
      recipient: recipient,
      subject: subject,
      body: body,
      scheduledTime: scheduledTime
    });
    await email.save();    
    schedule.scheduleJob(new Date(scheduledTime),function(){
      sendEmail(email)
    })
    res
      .status(201)
      .json({ message: "Email scheduled successfully", email: email });
   
  } catch (err) {
    console.log({ message: "Failed to schedule email" });
  }
};

const sendEmail = async (email) => {
  try {
    const { recipient, subject, body } = email;
    //create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });
    const mailOptions = {
      from: "xyz@gmail.com",
      to: recipient,
      subject: subject,
      text: body
    };
    await transporter.sendMail(mailOptions);
    await Emails.findByIdAndUpdate(email._id, { $set: { status: "sent" } });
  } catch (error) {
    await Emails.findByIdAndUpdate(email._id, { $set: { status: "failed" } });
    throw new Error(
      `Something went wrong in the sendmail method. Error: ${error.message}`
    );
  }
};

exports.getUnsentEmails = async (req, res, next) => {
  try {
    const emails = await Emails.find({ status: "failed" });
    res
      .status(200)
      .json({ message: "Fetched all unsent Emails", email: emails });
  } catch (err) {
    res.status(500).json({ error: "Failed to list unsent emails" });
  }
};

exports.updateScheduleEmail = async (req, res, next) => {
  try {
    const emailId = req.params.id;
    const { recipient, subject, body, scheduledTime } = req.body;

    const updatedEmail = await Emails.findByIdAndUpdate(
      emailId,
      { recipient, subject, body, scheduledTime },
      { new: true }
    );

    if (updatedEmail.status == "scheduled") {
      const job = schedule.scheduledJobs[emailId];
      if (job) {
        job.cancel();
      }
      schedule.scheduleJob(new Date(scheduledTime), () => {
        sendEmail(updatedEmail);
      });
    }
    res.status(201).json({
      message: "updated scheduled email successfully",
      email: updatedEmail
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update email" });
  }
};

exports.deleteScheduleEmail = async (req, res, next) => {
  try {
    const emailId = req.params.id;
    const deleteEmail = await Emails.findByIdAndDelete(emailId);

    const job = schedule.scheduledJobs[emailId];
    if (job) {
      job.cancel();
    }

    res.json({ message: "Scheduled email deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete schedule email" });
  }
};
