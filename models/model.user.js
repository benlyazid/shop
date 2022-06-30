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


// class User {
//     constructor(name, mail, cart){
//         this.name = name
//         this.mail = mail
//         this.cart = cart;
//     }

//     static countUsers(name, mail){
//         const _db = getDb()
//         return _db.collection('users').count()
//     }

//     static getUser(userId){
//         const _db = getDb()
//         if (userId === undefined)
//             return _db.collection('users').findOne()
//         return _db.collection('users').findOne({_id : new ObjectId(userId)})

//     }
//     // 
//     static insertUser(name, mail){
//         const _db = getDb()
//         const _user = new User(name, mail)
//         return _db.collection('users').insertOne(_user)
//     }

//     static addProductToCart(productId, user){
//         const _db = getDb()
//         const _id = user._id
//         const _cart = user.cart
//         const _items = user.cart.items
//         let _updatedCart
        
//         const _item = _items.find(item => {
//             if (item.productId  == productId)
//             return item
//         })
//         if (_item){
//             const indexOfItem = _items.indexOf(_item)
//             console.log("PRODUCT ALREDY exist in index " +  indexOfItem)
//             _updatedCart = _cart
//             const itemQuantity = _updatedCart.items[indexOfItem].quantity
//             _updatedCart.items[indexOfItem].quantity = itemQuantity + 1
//         }
//         else{
//             console.log("THIS IS A NEW PRODUCT")
//             _updatedCart = {items : user.cart.items.concat([ {productId, quantity : 1}])}
//         }
//         console.log("UPDATED_CART IS " + JSON.stringify(user.cart))         
//         return _db.collection('users').updateOne({ _id : new ObjectId(_id)},{
//             $set : {cart : _updatedCart}
//         })
//     }

//     static getCart(userId){
//         const _db = getDb()
//         return _db.collection('users').findOne({_id : new ObjectId(userId)})
//     }
//     static updateCart(userId, newCart){
//         const _db = getDb()
//         const productToUpdate = {_id: ObjectId(userId)}
//         return _db.collection('users').updateOne(productToUpdate, {$set : {cart : newCart}})
//     }
// }
