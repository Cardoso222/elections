var async = require('async');
var electionsController = require('./elections');

module.exports.dashboard = function(req, res) {
  var response = {};
  async.waterfall([
    function(callback) {
      electionsController.getAllElections(req, res, callback);
    },
    function(elections, callback) {
      response.session = req.session;
      response.elections = elections;
      electionsController.getVotedElections(req, res, callback);
    },
    function(voted, callback) {
      response.elections.forEach(function(election, index) {
        if(voted.includes(election.id) ) {
          election.voted = true;
        }
      })
      callback(null, response);
    }
  ],
    function(error, c) {
      if (error) return res.redirect('/login');

      return res.render("admin-dashboard.html", response);
    }
  )
};

module.exports.newCandidate = function(req, res) {
  if (req.session.type == 1) {
    return res.render("new-candidate.html", {electionId: req.params.electionId});
  }

  return res.redirect("/login");
};

