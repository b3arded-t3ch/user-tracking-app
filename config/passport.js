const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');


module.exports = function(passport) {
	passport.use(
		new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
			try {
				const user = await User.findOne({ username: username });
				if (!user) {
					return done(null, false, req.flash('message', 'Incorrect username'));
				}
				console.log("Password provided:", password);
				console.log("Stored hashed password:", user.password);

				if (!user.password) {
					console.log("Error: User has no password in the database.");
					return done(null, false, { message: 'User has no password set.' });
				}
				const isMatch = await bcrypt.compare(password, user.password);
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, req.flash('message', 'Incorrect password.'));
				}
			} catch (err) {
				return done(err);
			}
		}));
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch (err) {
			done(err);
		}
	});
};
