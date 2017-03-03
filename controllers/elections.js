var db = require('../config/connection');
var async = require('async');

module.exports.vote = function(req, res) {
  async.waterfall([
    function(callback) {
      newVote(req, res, callback);
    },
    function(callback) {
      getElectionVote(req, res, callback);
    },
    function(Nvotes, callback) {
      updateElectionVote(req, res, Nvotes, callback);
    }
  ], function (error, c) {
    if (error) {
      req.session.error = true;
      return res.redirect('/dashboard');
    }

    req.session.sucessVote = true;
    return res.redirect('/dashboard');
  });
};


function newVote(req, res, callback) {
  var candidateId = req.params.candidateId;
  var electionId = req.params.electionId;
  db.connection.query('insert into votes (electionId, candidateId) values (?, ?)', [electionId, candidateId], 
    function(err, result) {
      if (!err) return callback(null); 

      return callback(true);
    }
  )
}

function getElectionVote(req, res, callback) {
  var electionId = req.params.electionId; 
  db.connection.query('select count(*) as Nvotes from votes where electionId = ?', [electionId], 
    function(err, result) {
      var Nvotes = result[0].Nvotes;
      if (!err) return callback(null, Nvotes); 

      return callback(true);
    }
  )
}

function updateElectionVote(req, res, Nvotes, callback) {
  var electionId = req.params.electionId; 
  db.connection.query('UPDATE elections SET Nvotes = ? WHERE id = ?', [Nvotes, electionId],
    function(err, result) {
      if (!err) return callback(null);

      return callback(true);
    } 
  )
}
