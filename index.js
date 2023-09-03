const db = require('./config/database');
const dotenv = require('dotenv');
dotenv.config({path : './config.env'});
const express = require('express');
const cookieParser = require('cookie-parser'); // parse cookie header and populate req.cookies
const bodyParser = require('body-parser'); // parses incoming request bodies (req.body)
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8000;

const expressLayouts = require('express-ejs-layouts');

// used for session cookie
const session = require('express-session'); 
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const { config } = require('dotenv');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(expressLayouts);

app.use(cors({credentials : true}));

// set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: 'employee-review-system',
    secret: "divyesh",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
       mongoUrl: 'mongodb://127.0.0.1:27017/myapp',
      autoRemove: 'disabled',
    }),
    function(err) {
      console.log(err || 'connect-mongodb setup ok');
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// sets the authenticated user in the response
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));

app.listen(port, (err) => {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});