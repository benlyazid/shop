const bcrypt = require('bcryptjs');
const flash = require('connect-flash/lib/flash');
const User = require('../models/model.user');
const Authenticator = require('../utils/42auth');

UID="b22e551c17f2caf8076c66dffff335644bdaf61b21a925ce8dca0f88b1101d2a";
SECRET="5123cf97f349cedb88da5bf5da2c57e122a5a7b23434a46edcf74d134c65e8b3";
REDIRECT_URI='http://localhost:3000/auth42'

exports.getLogin = (req, res, next) => {
	let errorMessage = req.flash('errorMessage')
	if (errorMessage.length > 0)
		errorMessage = errorMessage[0]
	else
		errorMessage = null 
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isLoggedIn : false,
		errorMessage : errorMessage
	});
};

exports.postLogin = (req, res, next) => {
	const mail = req.body.email
	const password = req.body.password
	User.findOne({mail : mail})
	.then(user => {
		if (!user){
			console.log("user not found")
			req.flash('errorMessage', 'Invalide Email or Password')
			return res.redirect('/login')
		}
		bcrypt.compare(password, user.password)
		.then(doMatch => {
			if (doMatch){
				req.session.user = user
				req.session.isLoggedIn = true
				req.session.save(err =>{
					if (err)
						console.log("err in session " + err)
					return res.redirect('/')
				})
			}
			else{
				req.flash('errorMessage', 'Invalide Email or Password')
				console.log("password not mutch")
				return res.redirect('/login')
			}
		})
		.catch(err => {
			console.login("ERR in Login " + err)
		})
	})
	.catch(err => console.log("err is " + err))
};

exports.postLogout = (req, res, next) =>{
	req.session.destroy()
	res.redirect('/')
};

exports.getSignup = (req, res, next) =>{
	let errorMessage = req.flash('errorMessage')
	if (errorMessage.length > 0)
		errorMessage = errorMessage[0]
	else
		errorMessage = null 
	res.render('auth/signup', {
		path : '/signup',
		pageTitle : 'Signup',
		isLoggedIn : false,
		errorMessage : errorMessage
	})
};

exports.postSignup = (req, res, next) =>{
	const email = req.body.email
	const password = req.body.password
	const confirmPassword = req.body.confirmPassword
	console.log("PostSignup  " + email + "   " +  password)
	console.log("PostSignup  " + confirmPassword + "   " +  password)
	if (password != confirmPassword){
		req.flash('errorMessage', 'Password dosn\'t match')
		return res.redirect('/signup')

	}
	User.findOne({mail : email})
	.then(user => {
		console.log("User Found is " + user)
		if (user){
			req.flash('errorMessage', 'Email Already Exist')
			return res.redirect('/signup')
		}
		return bcrypt.hash(password, 7)
		.then(hashedPassword => {
			const _user = new User({
				mail : email,
				password : hashedPassword,
				cart : { items : []}
			})
			return _user.save()
		})
		.then(data => {
			res.redirect('/login')
		})
		.catch(err => {
			console.log("err in saving user " + err)
		})
	})
};

exports.postLogout = (req, res, next) =>{
	req.session.destroy()
	res.redirect('/')

};

exports.postLoginWithIntra = (req, res, next) =>{
	res.redirect('/')
}

exports.auth42 = (req, res, next) => {
	console.log("THE CODE IS : " + req.query.code);
	var app = new Authenticator(UID, SECRET, REDIRECT_URI);
	var token = app.get_Access_token(req.query.code);

	token
	.then((data) => {
		// get the acces token of the user
		console.log("======================== auth user Data =========================");
		console.log(data);
		console.log("========================= 42 user data ==========================");
		// get the user info from 42 api
		const accessToken  = data.access_token
		app.get_user_data(accessToken)
		.then((data) => {
			console.log(data);
			console.log("=============================================================");
		});
	});

	res.redirect('/')
}