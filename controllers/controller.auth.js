const bcrypt = require('bcryptjs')
const User = require('../models/model.user');

exports.getLogin = (req, res, next) => {
	console.log(req.session)
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isLoggedIn : false
	});
};

exports.postLogin = (req, res, next) => {
	const mail = req.body.email
	const password = req.body.password
	User.findOne({mail : mail})
	.then(user => {
		if (!user){
			console.log("user not found")
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
	res.render('auth/signup', {
		path : '/signup',
		pageTitle : 'Signup',
		isLoggedIn : false
	})
};

exports.postSignup = (req, res, next) =>{
	const email = req.body.email
	const password = req.body.password
	const confirmPassword = req.body.password
	console.log("PostSignup  " + email + "   " +  password)
	User.findOne({mail : email})
	.then(user => {
		console.log("User Found is " + user)
		if (user){
			res.redirect('/signup')
			return
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
