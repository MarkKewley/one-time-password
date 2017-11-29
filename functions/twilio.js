// config setup for twilio's Node.js client
const twilio = require('twilio');
const twilioAccount = require('./twilio_account.json');

const accountSid = twilioAccount.sid;
const authToken = twilioAccount.token;

module.exports = new twilio.Twilio(accountSid, authToken);