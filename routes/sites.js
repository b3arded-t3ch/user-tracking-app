const express = require('express');
const Site = require('../models/sites');
const ActivityLog = require('../models/activityLog');
const activityLogger = require('../middleware/activityLogger');
const router = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

// List all sites
router.get('/sites', isAuthenticated, async (req, res) => {
	try {
		const sites = await Site.find();
		res.render('sites', { title: 'Site List', sites });
	} catch (error) {
		res.status(500).send('Error fetching sites');
	}
});

// View a specific site
router.get('/sites/:siteId', isAuthenticated, activityLogger, async (req, res) => {
	try {
		const site = await Site.findById(req.params.siteId);
		if (!site) {
			return res.status(404).send('Site not found');
		}
		res.render('siteDetail', { title: 'Site Detail', site });
	} catch (error) {
		res.status(500).send('Error fetching site details');
	}
});

// Edit a site (GET - form)
router.get('/sites/:siteId/edit', isAuthenticated, async (req, res) => {
	try {
		const site = await Site.findById(req.params.siteId);
		if (!site) {
			return res.status(404).send('Site not found');
		}
		res.render('editSite', { title: 'Edit Site', site });
	} catch (error) {
		res.status(500).send('Error fetching site details');
	}
});

// Edit a site (POST - update)
router.post('/sites/:siteId/edit', isAuthenticated, activityLogger, async (req, res) => {
	try {
		const site = await Site.findByIdAndUpdate(req.params.siteId, {
			name: req.body.name,
			country: req.body.country,
			description: req.body.description,
			updatedAt: Date.now()
		}, { new: true });

		if (!site) {
			return res.status(404).send('Site not found');
		}
		res.redirect(`/sites/${site._id}`);
	} catch (error) {
		res.status(500).send('Error updating site');
	}
});

module.exports = router;
