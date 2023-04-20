const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailSchema = new Schema({
  recipient: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  status: {
    type:String,
    enum:['scheduled','sent','failed'],
    default:'scheduled'
  }
});

module.exports = mongoose.model("Email", emailSchema);
