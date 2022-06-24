const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const nodeUserPassword = '3oMAodrz4650SFOQ'
const url = `mongodb+srv://node_user:${nodeUserPassword}@cluster0.xohjs8d.mongodb.net/?retryWrites=true&w=majority`
const connectToMongo = (callBack) =>{
	MongoClient.connect(url)
	.then(client => {
		console.log("connected\n\n")
		callBack(client)
	})
	.catch(err => console.log("err is \n\n" + err))
}
// 3oMAodrz4650SFOQ