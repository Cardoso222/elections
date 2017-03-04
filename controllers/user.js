var db = require('../config/connection');

module.exports.authenticate = function(req, res) {
  if (req.body) {
    db.connection.query('SELECT * FROM users WHERE email = ? and password = ?', [req.body.email, req.body.password],
      function(err, rows) {
        if (!err && rows.length > 0) {
          req.session.userId = rows[0].id;
          req.session.email = rows[0].email;
          req.session.type = rows[0].type;
          req.session.error = false;

          if (req.session.type == 1) return res.redirect ('/admin');
          if (req.session.type == 2) return res.redirect('/dashboard');
        }

        req.session.error = true;
        return res.redirect('/login');
      }
    );
  }
};

function getParticipations () {
//TODO load Ncandidates
};

function getAllCandidates () {
//TODO load all election who user participate
};
