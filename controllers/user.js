var db = require('../config/connection');

module.exports.authenticate = function(req, res) {
  if (req.body) {
    db.connection.query('SELECT * FROM users WHERE email = ? and password = ?', [req.body.email, req.body.password],
      function(err, rows) {
        if (!err && rows.length > 0) {
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

module.exports.dashboard = function(req, res) {
//TODO load Ncandidates
  db.connection.query('SELECT * FROM elections',
    function(err, rows) {
      if(!err && rows.length > 0) {
        var elections = [];
        rows.forEach(function(election, index) {
          var obj = {};
          obj.title = election.title;
          obj.statusId = election.statusId;
          obj.initialDate = election.initialDate;
          obj.endDate = election.endDate;
          obj.Ncandidates = election.Ncandidates;
          obj.Nvotes = election.Nvotes;
          obj.url_friendly = election.url_friendly;

          elections.push(obj);
        });

        res.render('user-dashboard.html', {session: req.session, elections: elections});
        req.session.unsetNotifications();
      }
    }
  )
};
