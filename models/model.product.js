// const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const connectToMongoose  = require('../util/database').connectToMongoose

const ProductShema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('Product', ProductShema);
