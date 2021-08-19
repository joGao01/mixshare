const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

const connection = require('./config/database');
const indexRouter = require('./routes/index');
const path = require("path")


require('dotenv').config();

const app = express();

// ... other app.use middleware 
app.use(express.static(path.join(__dirname, "client", "build")))

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET));
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
  name: 'sid',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions',
  }),
  rolling: true,
  cookie: {
    maxAge: 1000 * 60 * 15,
    secure: false,
    sameSite: 'strict',
  },
};

if (app.get('env') == 'production') {
  app.set('trust proxy', 1);
  sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);


// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(+process.env.PORT || 3001, () => {
  console.log('Listening on port 3001...');
});

module.exports = app;
