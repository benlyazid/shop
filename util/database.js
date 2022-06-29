const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const mongoose = require('mongoose')


const nodeUserPassword = '3oMAodrz4650SFOQ'
const user = 'node_user' //! admin user
const db = 'shop'
const url = `mongodb+srv://${user}:${nodeUserPassword}@cluster0.xohjs8d.mongodb.net/${db}?retryWrites=true&w=majority`
let _db;

const connectToMongo = (callBack) =>{
	MongoClient.connect(url)
	.then(client => {
		_db = client.db()
		console.log("connected\n\n")
		callBack()
	})
	.catch(err => console.log("err is \n\n" + err))
}

const getDb =() =>{
	if (_db){
		return _db;
	}
	console.log("DATABASE NOT FOUND")
	throw "No Database Found !"
}

const connectToMongoose = () =>{
	return mongoose.connect(url)
}


exports.getDb = getDb
exports.connectToMongo = connectToMongo
exports.connectToMongoose = connectToMongoose