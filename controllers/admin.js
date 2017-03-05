var async = require('async');
var elections = require('./elections');

module.exports.dashboard = function(req, res) {
  var response = {};
  async.waterfall([
    function(callback) {
      elections.getAllElections(req, res, callback);
    },
    function(elections, callback) {
      response.session = req.session;
      response.elections = elections;
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
