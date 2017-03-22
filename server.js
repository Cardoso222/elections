var express = require('express');
var expressSession = require('express-session');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');
var io = require('socket.io');

var upload = multer({ dest: './public/img/candidates/' });

var user = require('./controllers/user');
var election = require('./controllers/elections');
var candidates = require('./controllers/candidates');
var admin = require('./controllers/admin');

var app = require('express')();

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
app.get('/logout', user.logout);

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

//admin
app.get('/admin', admin.dashboard);
app.get('/novo_candidato/:electionId', admin.newCandidate);
app.post('/candidate/new', upload.single('pic_name'), candidates.new);
app.get('/nova_eleicao', election.new);
app.post('/elections/new', election.create);


app.get('/dashboard', election.dashboard);
app.get('/election/:url_friendly', candidates.all);
app.post('/vote/:candidateId/:electionId', election.vote);

app.get('/finalizar_eleicao/:electionId', candidates.votes);

app.listen(3000, function () {
  console.log('server listening on port 3000!');
});

