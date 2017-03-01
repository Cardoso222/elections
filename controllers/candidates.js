var db = require('../config/connection');

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

        res.render('election.html', {candidates: candidates});
      }
    }
  )
};
