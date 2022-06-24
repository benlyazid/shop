const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const nodeUserPassword = '3oMAodrz4650SFOQ'
const url = `mongodb+srv://node_user:${nodeUserPassword}@cluster0.xohjs8d.mongodb.net/shop?retryWrites=true&w=majority`
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

exports.connectToMongo = connectToMongo
exports.getDb = getDb