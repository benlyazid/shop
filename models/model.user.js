const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const UserShema = new mongoose.Schema({
	password : {
		type : String,
		required : true
	},
	mail : {
		type : String,
		required : true    
	},
	cart : {
		items : [{
		productId : {
			ref : 'Product',
				type : mongoose.Schema.ObjectId,
				required : true
			},
			quantity : {
				type : Number,
				required : true
			}
		}]
	}
})

module.exports = mongoose.model('User', UserShema);