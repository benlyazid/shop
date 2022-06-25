const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/controller.error');

const connectToMongo = require('./util/database').connectToMongo

const adminRoutes = require('./routes/route.admin');
const shopRoutes = require('./routes/route.shop');

const app = express();

const User = require('./models/model.user')
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) =>{

    console.log('***********************************')
    console.log('REQUSET URL IS ' + req.url)
    console.log('***********************************')
    next()
})

app.use((req, res, next) =>{
    console.log()
    connectToMongo(() =>{
        User.countUsers()
            .then(count =>{
                if (count  == 0){
                    console.log("There is no user")
                    return User.insertUser('user', 'user@.admin.shop.ma')
                        .then(()=> User.getUser())
                }
                else{
                    console.log("There is a user")
                    return User.getUser()
                }
            })
            .then(user => {
                console.log("user is : " + user.mail)            
                console.log("Start listening")
                req.user = user
                next()
            })
            .catch(err =>{
                console.log("error is : \n\n" + err)
            })
        })
        
    })
    
        
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
app.listen(3000);

