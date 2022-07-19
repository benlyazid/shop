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
const nodeUserPassword = '3oMAodrz4650SFOQ'
const user = 'node_user'
const db = 'shop'
const url = `mongodb+srv://${user}:${nodeUserPassword}@cluster0.xohjs8d.mongodb.net/${db}`
const csrf = require('csurf')
const flash = require('connect-flash')
require('dotenv').config()
var store = new MongoDBStore({
	uri: url,
	collection: 'Sessions'
});

store.on('error', (errore)=>{
	console.log('Session errore ' + errore)
})


const app = express();

const csrfProtection = csrf()
app.set('view engine', 'ejs');
app.set('views', 'views');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
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
	console.log("env is   " + process.env.ROOT)
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

	