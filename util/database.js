const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.DATABSE_CONNECTION_URL

const connectToMongoose = () =>{
	return mongoose.connect(url, {
		dbName : 'shop'
	})
}

exports.connectToMongoose = connectToMongoose      