exports.getLogin = (req, res, next) => {
  console.log(req.session)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn : false
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true')
  req.session.isLoggedIn = true
  res.redirect('/')
};
