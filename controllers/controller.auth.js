const bcrypt = require('bcryptjs');
const User = require('../models/model.user');
const Authenticator = require('../util/42auth');
const {validationResult} = require('express-validator')
require('dotenv').config()

UID= process.env.UID;
SECRET= process.env.SECRET;
REDIRECT_URI=process.env.REDIRECT_URI;

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
		errorMessage : errorMessage,
		oldData :{
			email : "",
			password : "",
		}
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
			return res.status(422).render('auth/login', {
				path: '/login',
				pageTitle: 'Login',
				isLoggedIn : false,
				errorMessage :  req.flash('errorMessage'),
				oldData :{
				email : mail,
				password : password
				}
		});

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
				return res.status(422).render('auth/login', {
					path: '/login',
					pageTitle: 'Login',
					isLoggedIn : false,
					errorMessage :  req.flash('errorMessage'),
					oldData :{
					email : mail,
					password : password
					}
			});
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
		errorMessage : errorMessage,
		oldData :{
			email : "",
			password : "",
			confirmPassword : ""
		}
	})
};

exports.postSignup = (req, res, next) =>{
	const email = req.body.email
	const password = req.body.password
	const confirmPassword = req.body.confirmPassword
	let errorMessage = null
	const errors = validationResult(req).array();
	if (errors.length)
		errorMessage =  errors[0].msg
	console.log("-------------")
	console.log(errors)
	console.log(errors.isEmpty)
	console.log("-------------")
	if (errors.length){
		console.log("error was found " + errors)
		return res.status(422).render('auth/signup', {
			path : '/signup',
			pageTitle : 'Signup',
			isLoggedIn : false,
			errorMessage : errorMessage,
			oldData :{
				email : email,
				password : password,
				confirmPassword : confirmPassword
			}
		})
	}
	User.findOne({mail : email})
	.then(user => {
		console.log("User Found is " + user)
		if (user){
			req.flash('errorMessage', 'Email Already Exist')
			errorMessage = req.flash('errorMessage')

			// res.redirect('/signup')

			return res.status(422).render('auth/signup', {
				path: '/signup',
				pageTitle: 'Signup',
				errorMessage : errorMessage,

				oldData :{
					email : email,
					password : password,
					confirmPassword : confirmPassword
				}
			})
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
			console.log('user has been save successly')
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

exports.auth42 = async (req, res, next) => {
	var app = new Authenticator(UID, SECRET, REDIRECT_URI);
	var data = await app.get_Access_token(req.query.code);
	//? get the acces token of the user
	console.log("======================== auth user Data =========================");
	console.log(data);
	console.log("========================= 42 user data ==========================");
	//? get the user info from 42 api
	const accessToken  = data.access_token
	if (!accessToken){
		return res.redirect('/login')

	}
	app.get_user_data(accessToken)
	.then((data) => {
		const userEmail = data.email;
		User.findOne({mail : userEmail})
		.then(_user => {
			if (_user){ //? user already in database
				bcrypt.compare(toString(data.id), _user.password)
				.then(doMatch => {
					if (doMatch){
						req.session.user = _user
						req.session.isLoggedIn = true
						req.session.save(err =>{
							if (err)
								console.log("err in session " + err)
							return res.redirect('/')
						})
					}
					else{
						req.flash('errorMessage', 'This email is already used')
						return res.redirect('/login')
					}
				})
				.catch(err => {
					console.login("ERR in Login " + err)
				})
			}
			else {	//? new user that we should save in database
				bcrypt.hash(toString(data.id), 7)
				.then(hashedPassword => {
					const newUser = new User({
						mail : userEmail,
						password : hashedPassword,
						cart : { items : []}
					})
					return newUser.save()
				})
				.then(data => {
					req.session.user = _user
					req.session.isLoggedIn = true
					req.session.save(err =>{
						if (err)
							console.log("err in session " + err)
						return res.redirect('/')
					})
				})
				.catch(err => {
					console.log("err in saving user " + err)
				})
			}
		})
		.catch(err => console.log(err))
	})
	.catch(err => {
		
		console.log("=====CRASH========");
		console.log(err)
		console.log("=====CRASH========");
	})


}