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


// const getDb  = require('../util/database').getDb
// class Product{
//     constructor(title, price, description, imageUrl, userId){
//         this.title = title
//         this.price = price
//         this.description = description
//         this.imageUrl = imageUrl
//         this.userId = userId
//     }
//     save(){
//         const _db = getDb()
//         return _db.collection('products').insertOne(this)


//     }
//     static findAll(){
//         const _db = getDb()
//         return _db.collection('products').find().toArray()
//     }
//     static findById(productId){
//         const _db = getDb()
//         return _db.collection('products').findOne({'_id' : ObjectId(productId)})
//     }
    
//     static updateProduct(productId, newProduct){
//         const _db = getDb()
//         const productToUpdate = {_id: ObjectId(productId)}
//         return _db.collection('products').updateOne(productToUpdate, {$set : newProduct})
//     }
    
//     static deleteProduct(productId){
//         const _db = getDb()
//         return _db.collection('products').deleteOne({'_id' : ObjectId(productId)})
//     }   
// }
