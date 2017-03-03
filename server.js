var express = require('express');
var expressSession = require('express-session');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var path = require('path');

var user = require('./controllers/user');
var election = require('./controllers/elections');
var candidates = require('./controllers/candidates');
var app = express();

app.use(expressSession({
    secret: 'littlecup',
    key: 'DA31IMASDJ',
    proxy: 'true',
    resave: false,
    saveUninitialized: true,
  })
);

var nunjucksEnv = nunjucks.configure('views', {
  autoescape: true,
  express: app
});
require('./config/nunjucksFilters.js')(nunjucksEnv);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/login', function (req, res) {
  res.render('login.html', {session: req.session});
});

app.post('/authenticate', user.authenticate); 

//check if user are authenticated
app.use(function(req, res, next) {
  req.session.unsetNotifications = function() {
    this.error = false;
    this.successVote = false;
    this.errorVote = false;
  };

  if (!req.session.email) return res.redirect("/login");

  next();
});

app.get('/dashboard', user.dashboard);

app.get('/election/:url_friendly', candidates.all);
app.post('/vote/:candidateId/:electionId', election.vote);

app.listen(3000, function () {
  console.log('server listening on port 3000!');
});

