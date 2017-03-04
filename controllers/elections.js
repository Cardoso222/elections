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
    },
    function(callback) {
      setUserVotes(req, res, callback);
    }
  ], function (error, c) {
    if (error) {
      req.session.errorVote = true;
      return res.redirect('/dashboard');
    }

    req.session.successVote = true;
    return res.redirect('/dashboard');
  });
};

module.exports.dashboard = function (req, res) {
  var response = {};
  async.waterfall([
    function(callback) {
      getAllElections(req, res, callback);
    },
    function (elections, callback) { 
      response.elections = elections;
      getUserVotes(req, res, callback); 
    },
    function (votedElections, callback) {
      req.session.votedElections = votedElections;
      setVotedElections(votedElections, response.elections, callback);
    }
  ], function(error, elections) {
    if (error) {
      req.session.error = true;
      return res.send("error"); 
    }

    response.elections = elections;
    res.render('user-dashboard.html', response);
    req.session.unsetNotifications();
  });
};

function setVotedElections(votedElections, elections, callback) {
  elections.forEach(function(election) {
    votedElections.includes(election.id) ? election.userVoted = true : election.userVoted = false;
  })
  callback(null, elections);
};

function getAllElections(req, res, callback) {
  db.connection.query('SELECT * FROM elections',
    function(err, rows) {
      if(!err && rows.length > 0) {
        var elections = [];
        rows.forEach(function(election, index) {
          var obj = {};
          obj.id = election.id;
          obj.title = election.title;
          obj.statusId = election.statusId;
          obj.initialDate = election.initialDate;
          obj.endDate = election.endDate;
          obj.Ncandidates = election.Ncandidates;
          obj.Nvotes = election.Nvotes;
          obj.url_friendly = election.url_friendly;

          elections.push(obj);
        });
        return callback(null, elections);
      }
      return callback(true);
    }
  )
};

function getUserVotes(req, res, callback) {
  db.connection.query('SELECT electionId FROM usersHistory WHERE userId = ?', [req.session.userId],
    function(err, rows) {
      if (!err) {
        var votedElections = [];
        rows.forEach((row) => 
          votedElections.push(row.electionId)
        )
        return callback(null, votedElections);
      }
      return callback(true);
    }
  );
};

function newVote(req, res, callback) {
  var candidateId = req.params.candidateId;
  var electionId = req.params.electionId;
  db.connection.query('INSERT INTO votes (electionId, candidateId) VALUES (?, ?)', [electionId, candidateId], 
    function(err, result) {
      if (!err) return callback(null); 

      return callback(true);
    }
  )
}

function getElectionVote(req, res, callback) {
  var electionId = req.params.electionId; 
  db.connection.query('SELECT count(*) as Nvotes FROM votes WHERE electionId = ?', [electionId], 
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

function setUserVotes (req, res, callback) {
  var userId = req.session.userId; 
  var electionId = req.params.electionId; 

  db.connection.query('INSERT INTO usersHistory (userId, electionId) VALUES (?, ?)', [userId, electionId],
      function(err, result) {
        if (!err) return callback(null);

        return callback(true);
      } 
    )
};
