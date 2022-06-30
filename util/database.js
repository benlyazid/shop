const mongoose = require('mongoose')

const nodeUserPassword = '3oMAodrz4650SFOQ'
const user = 'node_user' //! admin user
const db = 'shop'
const url = `mongodb+srv://${user}:${nodeUserPassword}@cluster0.xohjs8d.mongodb.net/${db}?retryWrites=true&w=majority`

const connectToMongoose = () =>{
	return mongoose.connect(url)
}

exports.connectToMongoose = connectToMongoose