const express = require('express');
const User = require('../models/user');
const router = express.Router();


function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	return redirect('/login');
}

router.get('/users', isAuthenticated, async (req, res) => {
	try {
		const users = await User.find().select('-password');
		res.render('users', { title: 'User List', users });
	} catch (error) {
		res.status(500).send('Error fetching users');
	}
});

router.get('users/:id', isAuthenticated, async (req, res) => {
	try {
		const users = await User.findById(req.params.id).select('-password');
		if (!user) {
			return res.status(400).send('User not found');
		}
		const recentViews = await ActivityLog.find({ userId: user._id, action: 'view' })
			.sort('-date')
			.limit(10)
			.populate('siteId');

		const recentEdits = await ActivityLog.find({ userId: user._id, action: 'edit' })
			.sort('-date')
			.limit(10)
			.populate('siteId');
		res.render('userDetail', { title: 'User Detail', user, recentViews, recentEdits });
	} catch (error) {
		res.status(500).send('Error fetching user details');
	}
});

module.exports = router;
