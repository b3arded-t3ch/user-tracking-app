require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const flash = require('connect-flash');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const siteRoutes = require('./routes/sites');

const app = express();
const port = process.env.PORT || 3000;

// Passport config
require('./config/passport')(passport);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/user_tracking_app', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// View engine setup
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash setup
app.use(flash());
app.use((req, res, next) => {
	res.locals.messages = req.flash();
	next();
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
        res.render('home', { title: 'Home', user: req.user });
});

// Routes
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', siteRoutes);

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`);
});
