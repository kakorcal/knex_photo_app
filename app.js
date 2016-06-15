const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('cookie-session');
const morgan = require('morgan');
const routes = require('./routes');

app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// app.use(session({
  // process.env.SECRET = 
// }));

app.use('./users', routes.users);
// app.use('./auth', routes.auth);
// app.use('./users/:id/photos', routes.photos);
  
app.get('*', (req, res)=>{
  res.send(404);
});

app.listen(3000, ()=>{
  console.log('Listening to port 3000');
});