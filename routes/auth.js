const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();


router.get('/register', (req, res) => {
	res.render('register', { title: 'Register' });
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
	res.render('login', { title: 'Login' });
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		failureFlash: true
	})(req, res, next);
});

//router.get('/login', (req, res) => {
//	res.render('login', { title: 'Login' });
//});

//router.post('/login', (req, res, next) => {
//	passport.authenticate('local', (err, user, info) => {
//		if (err) {
//			console.error('Login error:', err);
//			return next(err);
//		}
//		if (!user) {
//			req.flash('error', info.message || 'Login failed');
//			return res.redirect('/login');
//		}
//		req.logIn(user, (err) => {
//			if (err) {
//				console.error('Login error:', err);
//				return next(err);
//			}
//			return res.redirect('/dashboard');
//		});
//	})(req, res, next);
//});

router.get('/logout', (req, res, next) => {
	req.logout((err) => {
		if (err) { return next(err); }
		res.redirect('/');
	});
});

module.exports = router;

