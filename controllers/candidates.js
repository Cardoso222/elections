var db = require('../config/connection');
var multer = require('multer');

module.exports.all = function(req, res) {
  db.connection.query('SELECT * FROM elections, candidates WHERE url_friendly = ?' + 
     'AND candidates.electionId = elections.id', [req.params.url_friendly],
    function(err, rows) {
      if(!err && rows.length > 0) {
        var candidates = [];
        rows.forEach(function(candidate, index) {
          var obj = {};
          obj.id = candidate.id;
          obj.name = candidate.name;
          obj.age = candidate.age;
          obj.politicalParty = candidate.political_party;
          obj.picName = candidate.pic_name;
          obj.electionId = candidate.electionId;

          candidates.push(obj);
        });
        if (req.session.votedElections.includes(candidates[0].electionId))
          return res.redirect("/dashboard");

        return res.render('election.html', {candidates: candidates});
      }
    }
  )
};

module.exports.new = function(req, res) {
  var name = req.body.name;
  var age = req.body.age;
  var political_party = req.body.political_party;
  var electionId = req.body.electionId;
  var pic_name = req.file.filename;
  console.log(pic_name);
  console.log(req.body);
  db.connection.query('INSERT INTO candidates (name, age, political_party, pic_name, electionId) VALUES (?, ?, ?, ?, ?)', [name, age, political_party, pic_name, electionId],
    function(err) {
      if (err) {
        console.log(err);
        req.session.error = true;
        return res.redirect('/admin');
      }

      req.session.error = false;
      return res.redirect('/admin');
    }
  )
};
