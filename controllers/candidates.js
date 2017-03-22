var db = require('../config/connection');
var multer = require('multer');

module.exports.all = function(req, res) {
  db.connection.query('select * from elections, candidates where url_friendly = ?' +
     'and candidates.electionId = elections.id', [req.params.url_friendly],
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
        console.log(candidates);
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

module.exports.votes = function(req, res) {
  getCandidatesVotes(req, res).then(function(candidates) {
    getCandidatesInfo(candidates).then(function(candidatesInfo) {
      return res.render('end-election.html', {candidates: candidatesInfo, votes: candidates})
    })
  });
};

function getCandidatesVotes (req, res) {
  return new Promise(function(resolve, reject) {
    db.connection.query('SELECT candidateId, count(*) as totalVotos FROM votes WHERE electionId = ? GROUP BY candidateId;', [req.params.electionId],
      function(err, rows) {
        if(!err && rows.length > 0) {
          resolve(rows);
        }
      }
    )
  })
}

function getCandidatesInfo(candidates) {
  var result = [];
  return new Promise(function(resolve) {
    for (var i = 0; i < candidates.length; i++) {
      db.connection.query('SELECT * from candidates where id = ?', [candidates[i].candidateId],
        function(err, rows) {
          if(!err && rows) {
            result.push(rows[0]);
            if (result.length == candidates.length) resolve (result);
          }
        }
      )
    }
  })
}
