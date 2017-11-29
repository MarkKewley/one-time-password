const admin = require('firebase-admin');

module.exports = function(req, res) {
  const {phone, code} = req.body;
  if (!phone || !code) {
    return res.status(422).send({error: 'Phone and code must be provided'});
  }

  const validPhone = String(req.body.phone).replace(/[^\d]/g, '');
  const validCode = parseInt(code);

  // verify we have a user with the validPhone
  admin.auth().getUser(validPhone)
    .then(() => {
      const ref = admin.database().ref(`users/${validPhone}`);
      ref.on('value', snapshot => {
          // stop listening for any more values
          ref.off();
          const user = snapshot.val();

          if (user.code !== validCode || !user.codeValid) {
            return res.status(422).send({error: `Code: ${validCode} not valid`});
          }

          admin.auth().createCustomToken(validPhone)
            .then(token => {
              ref.update({codeValid: false});
              res.send({token})
            })
            .catch(err => {
              console.error(err);
              res.status(422).send({error: 'Could not send JWT token'});
            });
        });
    })
    .catch(err => {
      console.error(err);
      return res.status(422).send({error: 'User not found'});
    });
};