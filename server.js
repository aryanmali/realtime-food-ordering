require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const PORT = process.env.PORT || 3300;

//Database Connection
const url = 'mongodb://localhost/realtime-food'
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});

//Session Store
let mongoStore = new MongoDbStore({
                mongooseConnection: connection,
                collection: 'sessions'
            }) 

//Session Configuration
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60*24} // 24 Hours
}))
app.use(flash())

//Assets
app.use(express.static('public'))

//set Template Engine
app.use(expressLayout)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

//Routes
require('./routes/web')(app)

//Server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});