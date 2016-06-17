require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('cookie-session');
const morgan = require('morgan');
const routes = require('./routes');
const passport = require('passport');
const flash = require('connect-flash');

// Config
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(session({secret: process.env.SECRET}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
app.use('/home', routes.home);
app.use('/users', routes.users);
app.use('/auth', routes.auth);
app.use('/users/:user_id/photos', routes.photos);

app.get('/', (req, res)=>{
  res.redirect('./home');
});
  
app.get('*', (req, res)=>{
  res.render('error');
});

app.listen(3000, ()=>{
  console.log('Listening to port 3000');
});

// http://www.randomdoggiegenerator.com/randomdoggie.php