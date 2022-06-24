const { ObjectId } = require('mongodb')

const connectToMongo  = require('../util/database').connectToMongo
const getDb  = require('../util/database').getDb
class Product{
    constructor(title, price, description, imageUrl){
        this.title = title
        this.price = price
        this.description = description
        this.imageUrl = imageUrl
    }
    save(){
        const _db = getDb()
        return _db.collection('products').insertOne(this)
        // .then(res => console.log(res))
        // .catch(err => console.log(err))
    }
    static findAll(){
        const _db = getDb()
        return _db.collection('products').find().toArray()
    }
    static findById(productId){
        const _db = getDb()
        return _db.collection('products').findOne({'_id' : ObjectId(productId)})
    }
    
    static updateProduct(productId, newProduct){
        const _db = getDb()
        const productToUpdate = {_id: ObjectId}
        return _db.collection('products').updateOne(productToUpdate, {$set : newProduct})
    }
}

module.exports = Product;