const { ObjectId } = require('mongodb');

const getDb  = require('../util/database').getDb
const mongoose = require('mongoose')

const UserShema = new mongoose.Schema({
    name : {
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

