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

var store = new MongoDBStore({
	uri: url,
	collection: 'Sessions'
});

store.on('error', (errore)=>{
	console.log('Session errore ' + errore)
})

const app = express();

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
app.use((req, res, next) => {
	console.log('***********************************')
	console.log('REQUSET URL IS ' + req.url)
	console.log('REQUSET query IS ' + JSON.stringify(req.query))
	console.log('***********************************')
	next()
	//! YOU SHOULD CHANGE THIS TO USE DATABASE USER
	// User.findOne()
	// .then(user =>{
	// 	req.user = user
	// })
	// .catch(err => {
	// 	console.log("error in getting user " + err)
	// })
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

connectToMongoose()
	.then((res)=> {
		console.log("CONNECT SUCCEFULLY....\n" )

		// User.count().then(res =>{
		//     console.log(res)
		//     if (res != 0){
		//         console.log("USER ALREADY IN DATABASE :)")
		//     }
		//     else{
		//         //> insert  a new user
		//         console.log("THERE IS NO USER IN DATABASE :(")
		//         const user = new User({name : "seven", mail : "seven.admin.@shop.ma", cart : {items : []}})
		//         user.save().then(res => {
		//             console.log("INSERT USER SUCCEFULLY...")
		//         })
		//         .catch(err => console.log("ERROR IN INSERTING YHE USER " + err))
		//     }
		// })
		// .catch(err => console.log(err))

		app.listen(3000);
	})
	.catch(err => {
		console.log("ERROR ON CONNECT....\n" + err)
	})

	