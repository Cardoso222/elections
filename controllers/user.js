module.exports.authenticate = function(req, res) {
  if (req.body) {
    //should check if user exist in database
    req.session.email = 'teste@gmail.com';
    res.redirect('/dashboard');
  }
};

function getUserInfo (req, res) {
  //should get user info in database
}
