const mongoose = require('mongoose')

const OrderShema = new mongoose.Schema({
    products : [{
        product : { 
            type:  Object,
            required : true
        },
        quantity : {
            type : Number,
            required : true
        }
    }],
    user : {
        name : {
            type : String,
            required : true
        },
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : 'user'
        }
    }
})

module.exports = mongoose.model('Order', OrderShema)
