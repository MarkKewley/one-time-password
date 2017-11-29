const admin = require('firebase-admin'); // access to service account

// normally steps are for cloud functions:
// 1.) Validate input
// 2.) Massage data
// 3.) Perform the action/body of what we are trying to accomplish
// 4.) Return response to user
module.exports = function (req, res) {
  // Verify the user provided a phone
  if (!req.body.phone) {
    // set http status code that goes back to the user
    console.warn('No phone provided', req.body);
    return res.status(422)
      .send({error: 'Phone number expected!'});
  }

  // Format the phone number to remove dashes and parens
  // NOTE: With phones never guarantee it's a string or number
  const phone = String(req.body.phone).replace(/[^\d]/g, ''); // strip any character that IS NOT a digit

  // Create a new user account using that phone number
  admin.auth().createUser({uid: phone})
    .then((user) => res.send(user)) // Respond to the user request, saying the account was made
    .catch(err => {
      console.error(err);
      res.status(422).send({error: 'Could not save user!'})
    }); // Respond an error occurred
};