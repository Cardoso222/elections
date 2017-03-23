var db = require('../config/connection');
var async = require('async');

module.exports.vote = function(req, res) {
  async.waterfall([
    function(callback) {
      newVote(req, res, callback);
    },
    function(callback) {
      setUserVotes(req, res, callback);
    }
  ], function (error, c) {
    if (error) {
      req.session.errorVote = true;
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
      getElectionsVotes (req, res, callback);
    },
    function (votes, callback) {
      response.votes = votes;
      getElectionsCandidates(req, res, callback);
    },
    function (candidates, callback) {
      response.candidates = candidates;
      setVotedElections(req.session.votedElections, response.elections, callback);
    }
  ], function(error, elections) {
    if (error) {
      req.session.error = true;
      return res.send("error");
    }

    for (var i = 0; i < response.elections.length; i++) {
      for (var j = 0; j  < response.votes.length; j++) {
        if (response.elections[i].id == response.votes[j].electionId) {
          response.elections[i].votes = response.votes[j].votes;
        }
      }
      response.elections[i].candidates = response.candidates[i];
    }

    response.session = req.session;
    response.elections = elections;
    res.render('user-dashboard.html', response);
    req.session.unsetNotifications();
  });
};

module.exports.new = function(req, res) {
  return res.render('new-election.html');
};

module.exports.create = function(req, res) {
  var title = req.body.title;
  var initialDate = req.body.initialDate;
  var endDate = req.body.endDate;
  var url_friendly = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

  db.connection.query('INSERT INTO elections (statusId, title, initialDate, endDate, url_friendly) VALUES (?, ?, ?, ?, ?)', [1, title, initialDate, endDate, url_friendly],
    function(err, result) {
      if (err) {
        req.session.error = true;
      }

      req.session.error = false;
      return res.redirect('/admin');
    }
  )
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
      if(!err) {
        var elections = [];
        rows.forEach(function(election, index) {
          var obj = {};
          obj.id = election.id;
          obj.title = election.title;
          obj.statusId = election.statusId;
          obj.initialDate = election.initialDate;
          obj.endDate = election.endDate;
          obj.url_friendly = election.url_friendly;

          elections.push(obj);
        });
        return callback(null, elections);
      }
      return callback(true);
    }
  )
};

function getElectionsCandidates(req, res, callback) {
  db.connection.query('SELECT count(*) as total, electionId FROM candidates GROUP BY electionId',
    function(err, rows) {
      if(!err) {
        var candidates = [];
        rows.forEach(function(candidate, index) {

          candidates.push(candidate.total);
        });
        return callback(null, candidates);
      }
      return callback(true);
    }
  )
};

function getElectionsVotes(req, res, callback) {
  db.connection.query('SELECT count(*) as votes, electionId FROM votes GROUP BY electionId',
    function(err, rows) {
      if(!err) {
        var votes = [];
        rows.forEach(function(vote, index) {

          votes.push({votes: vote.votes, electionId: vote.electionId});
        });
        return callback(null, votes);
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

function setUserVotes (req, res, callback) {
  var userId = req.session.userId;
  var electionId = req.params.electionId;

  db.connection.query('INSERT INTO usersHistory (userId, electionId, createAt) VALUES (?, ?, NOW())', [userId, electionId],
    function(err, result) {
      if (!err) return callback(null);

      return callback(true);
    }
  )
};

function getVotedElections(req, res, callback) {
  db.connection.query('SELECT count(*) as votes, electionId FROM votes GROUP BY electionId',
    function(err, rows) {
      if(!err) {
        var voted = [];
        rows.forEach(function(vote, index) {

          voted.push(vote.electionId);
        });
        return callback(null, voted);
      }
      return callback(true);
    }
  )
};

exports.getVotedElections = getVotedElections;
exports.getAllElections = getAllElections;
