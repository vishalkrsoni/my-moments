const express = require('express');

const { check, body } = require('express-validator');

const {
	createPlace,
	getAllPlaces,
	getPlacesById,
	getPlacesByUserId,
	updatePlacesById,
	deletePlacesById
} = require('../controllers/places-controllers');

const fileUpload = require('../middelweare/file-upload');
const checkAuth = require('../middelweare/check-auth');

const router = express.Router();

router.get('/', getAllPlaces);

router.get('/:pid', getPlacesById);

router.get('/user/:uid', getPlacesByUserId);

router.use(checkAuth);

router.delete('/:pid', deletePlacesById);

router.patch('/:pid',
	[
		body('newTitle')
			.not()
			.isEmpty(),
		body('newDescription')
			.isLength({ min: 3 })
	],
	updatePlacesById);


router.post('/', fileUpload.single('image'),
	[check('title')
		.not()
		.isEmpty().
		withMessage('Must be not empty'),
	check('description')
		.isLength({ min: 5 }).withMessage('Must contain at least 5 characters'),
	check('address')
		.not()
		.isEmpty()
		.withMessage('Must be not empty')
	],
	createPlace);

module.exports = router;