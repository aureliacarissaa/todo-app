const express = require('express');
const app = express();
const PORT  = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var path = require('path');

const Todo = require('./models/todo');
const todoRoutes = require('./routes/todos');

const logger = require('./config/logger');
const morgan = require('morgan');

const cookieSession = require('cookie-session');
const passport = require('passport');
require('./config/passport-setup')


mongoose.connect('mongodb+srv://aureliacarissaa:0L2ncVscMiIHc31K@cluster0.besvt.mongodb.net/todo-app?retryWrites=true&w=majority', {useNewUrlParser: true}, {useUnifiedTopology: true})

mongoose.connection.on('connected', ()=>{
    console.log('MongoDB connected');
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieSession({
    name: 'todo-app',
    keys: ['key1', 'key2']
}))

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        res.sendStatus(401);
        res.render('./public/unauthorized.html')
    }
}

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/landing.html'));
});

app.get('/failed', (req, res) => res.send('You are not logged in!'));
app.get('/good', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/todo.html'));
});

app.get('/oauth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/oauth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  });

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined', { stream: logger.stream }));

app.use('/api', todoRoutes);

app.listen(PORT, ()=>{
    console.log('Server has been started at port:'+PORT);
});