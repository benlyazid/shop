const getDb  = require('../util/database').getDb

class User {
    constructor(name, mail){
        this.name = name
        this.mail = mail
    }

    static countUsers(name, mail){
        const _db = getDb()
        return _db.collection('users').count()
    }

    static getUser(){
        const _db = getDb()
        return _db.collection('users').findOne()
    }

    static insertUser(name, mail){
        const _db = getDb()
        const _user = new User(name, mail)
        return _db.collection('users').insertOne(_user)
    }


}

module.exports = User;