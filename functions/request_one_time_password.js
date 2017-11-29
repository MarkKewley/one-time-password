const admin = require('firebase-admin');
const twilio = require('./twilio');
const twilioAccountPhone = require('./twilio_account.json').phone;

module.exports = function (req, res) {
  // user's id is tied to phone number
  if (!req.body.phone) {
    return res.status(422).send({error: 'You must provide a phone number'});
  }

  // sanitize the input
  const phone = String(req.body.phone).replace(/[^\d]/g, ''); // strip any character that IS NOT a digit

  // grab the user
  admin.auth().getUser(phone)
    .then(userRecord => {
      // generate a random code between 1000-8999
      const code = Math.floor((Math.random() * 8999) + 1000);

      twilio.messages.create({
        body: `Your code is ${code}`,
        to: phone,
        from: twilioAccountPhone
      }, err => {
        if (err) {
          console.error(err);
          return res.status(422).send({error: `Could not send code to: ${phone}`});
        }

        admin.database().ref(`users/${phone}`)
          .update({code, codeValid: true}, () => {
            return res.send({success: true});
          })

      });
    })
    .catch(err => {
      console.error(err);
      return res.status(422).send({error: 'User not found'});
    });
};