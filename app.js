const path = require('path');
const mongoose = require('mongoose')
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/controller.error');
const adminRoutes = require('./routes/route.admin');
const authRoutes = require('./routes/route.auth');
const shopRoutes = require('./routes/route.shop');
const User = require('./models/model.user')
const connectToMongoose = require('./util/database').connectToMongoose
const Session = require('express-session');
const json = require('body-parser/lib/types/json');
var MongoDBStore = require('connect-mongodb-session')(Session);
const multer = require('multer')
require('dotenv').config()

const url = process.env.DATABSE_URL
const csrf = require('csurf')
const flash = require('connect-flash')
var store = new MongoDBStore({
	uri: url,
	collection: 'Sessions',
	databaseName: 'shop'
});

store.on('error', (errore)=>{
	console.log(url)
	console.log('Session errore ' + errore)
})


const app = express();

const csrfProtection = csrf()
app.set('view engine', 'ejs');
app.set('views', 'views');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images')
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
	  cb(null, file.fieldname + '-' + file.originalname)
	}
  })

const fileFilter = (req, file, cb) => {
	if (file.mimetype.includes('image'))
		cb(null, true)
	else
		cb(null, false)
}
  
app.use(multer({storage : storage, fileFilter : fileFilter}).single('image')) //? ffor parssing image 
  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(Session({
	secret : "THis Is the Secret",
	resave : false,
	saveUninitialized : false.valueOf,
	store : store
}))

app.use(csrfProtection)
app.use(flash())
app.use((req, res, next) => {
	console.log('***********************************')
	console.log('REQUSET URL IS ' + req.url)
	// console.log('REQUSET query IS ' + JSON.stringify(req.query))
	console.log('***********************************')
	next()
})

app.use((req, res, next)=>{
	res.locals.csrfToken = req.csrfToken() //? we should use locals , why ??
	res.locals.isLoggedIn = req.session.isLoggedIn

	next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

connectToMongoose()
	.then((res)=> {
		console.log("CONNECT SUCCEFULLY....\n" )
		app.listen(3000);
	})
	.catch(err => {
		console.log("ERROR ON CONNECT....\n" + err)
	})

	