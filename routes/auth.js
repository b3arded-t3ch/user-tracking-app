const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();


router.get('/register', (req, res) => {
	res.render('register', {
		title: 'Register',
		user: req.user || null,
		error: req.flash('error') || null
	});
});

router.post('/register', async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const user = new User ({
			username: req.body.username,
			password: hashedPassword,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			organization: req.body.organization,
			country: req.body.country
		});
		await user.save();
		req.flash('success', 'Registration successful. Please log in.');
		res.redirect('/login');
	} catch (error) {
		console.error('Registration error:', error);
		req.flash('error', 'Registration failed. Please try again.');
		res.redirect('/register');
	}
});

router.get('/login', (req, res) => {
	res.render('login', {
		title: 'Login',
		user: req.user || null,
		error: req.flash('error')
	});
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) { return next(err); }
		if (!user) {
			req.flash('error', 'Invalid username or password.');
			return res.redirect('/login');
		}
		req.logIn(user, async (err) => {
			if (err) { return next(err); }
			try {
				await updateLastLogin(req, res, () => {});
				return res.redirect('/dashboard');
			} catch (error) {
				console.error('Error during login:', error);
				return next(error);
			}
		});
	})(req, res, next);
});

router.get('/logout', (req, res, next) => {
	req.logout((err) => {
		if (err) { return next(err); }
		res.redirect('/');
	});
});

const updateLastLogin = async (req, res, next) => {
	if (req.user) {
		try {
			const updatedUser = await User.findByIdAndUpdate(
				req.user._id, 
				{ lastLoginDate: new Date() },
				{ new: true }
			);
			console.log('Updated user:', updatedUser);
		} catch (error) {
			console.error('Error updating last login:', error);
		}
	}
	next();
};

module.exports = router;
module.exports.updateLastLogin = updateLastLogin;

