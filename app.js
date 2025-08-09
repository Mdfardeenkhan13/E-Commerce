//Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');
const { default: mongoose } = require('mongoose');
const mongodbStorage = require('connect-mongodb-session')(session);
const DB_PATH = "mongodb+srv://fardeen:fardeen81870@coding.jujsuqt.mongodb.net/velora?retryWrites=true&w=majority&appName=Coding";

// Local Module
const rootDir = require('./utils/pathUtil');
const storeRouter = require('./router/storeRouter');
const hostrouter = require('./router/hostRouter');
const authRouter = require('./router/authRouter');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

//Granting across to public folder
app.use(express.static(path.join(rootDir, 'public')))

const store = new mongodbStorage({
    uri: DB_PATH,
    Collection: 'session',
})

app.use(express.urlencoded());

app.use(session({
    secret: "Learning Backend",
    resave: false,
    saveUninitialized: true,
    store: store,
}))

app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    next();
})

app.use(storeRouter);
app.use('/host', (req, res, next) => {
    if (req.isLoggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
})
app.use("/host", hostrouter);
app.use(authRouter);



const PORT = 4004;

mongoose.connect(DB_PATH).then(() => {
    console.log('connected to mongoose');
    app.listen(PORT, () => {
    console.log(`server running on address http://localhost:${PORT}`);
    })
}).catch(err => {
    console.log('Error while connecting to Mongo:', err)
})