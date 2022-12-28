const express = require('express');
const path = require('path')

const { check } = require('express-validator');

const { getUsers, login, signup } = require('../controllers/users-controllers');
const fileUpload = require('../middelweare/file-upload');

const router = express.Router();

const root = path.resolve('../../../../../frontend/public/index.html')
const root1 = path.resolve(__dirname + '/frontend/public/index.html')


// router.get('/', (req,res)=>{
//     res.sendFile(root)
// });
router.get('/', getUsers)

router.post('/signup',
	//mullter
	fileUpload.single('image'),
	[
		check('name')
			.not()
			.isEmpty()
			.withMessage('Must be not empty'),
		check('email')
			.normalizeEmail()
			.isEmail()
			.withMessage('Pease enter valid e-mail.'),
		check('password')
			.isLength({ min: 8 })
			.withMessage('Must contain at least 8 characters')
			.matches(/\d/).withMessage('must contain a number')
	], signup);

router.post('/login', login);

module.exports = router;