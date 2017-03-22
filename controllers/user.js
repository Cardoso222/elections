var db = require('../config/connection');
var crypto = require('crypto');

module.exports.authenticate = function(req, res) {
  if (req.body) {
    var password = saltHashPassword(req.body.password).passwordHash;
    db.connection.query('SELECT * FROM users WHERE email = ? and password = ?', [req.body.email, password],
      function(err, rows) {
        if (!err && rows.length > 0) {
          req.session.userId = rows[0].id;
          req.session.email = rows[0].email;
          req.session.type = rows[0].type;
          req.session.error = false;

          if (req.session.type == 1) return res.redirect ('/admin');
          if (req.session.type == 2) return res.redirect('/dashboard');
        }
        console.log(err);
        req.session.error = true;
        return res.redirect('/login');
      }
    );
  }
};

module.exports.logout = function(req, res) {
  req.session.destroy();
  return res.redirect('/login');
};

function saltHashPassword(userpassword) {
  var salt = 'salt';
  var passwordData = sha512(userpassword, salt);
  return passwordData;
}

var sha512 = function(password, salt){
  var hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
  };
};

