import express from 'express';
import commonValidations from '../shared/validations/signupValidation';
import {User, addUser} from '../models/user';
import isEmpty from 'lodash/isEmpty';
import {Notification} from '../models/notification';

let router = express.Router();


//Input validation for registration
function validateInput(data, otherValidations){
	let {errors} = otherValidations(data);
	
	return User.find({
		$or: [
			{username: data.username},
				{email: data.email}
		]
	}).then(user => {
		if(user.length){
			if(user[0].username === data.username){
				errors.username = 'Username is not available';
			}
			if(user[0].email = data.email){
				errors.email = 'Email is not available';
			}
		}
		return {
			errors,
			isValid: isEmpty(errors)
		}
	});
}


//Generate notification set for new user
function setNotificationDB(newNotificationDB, callback){
	newNotificationDB.save(callback);
}

//Get user information
router.get('/:identifier', (req, res) => {
	User.find({$or: [{username: req.params.identifier}, {email: req.params.identifier}]}, {_id:0, fullName:0, password:0, __v:0}).then(user => {
		res.json({user});
	});
});


//Final validations from registration
router.post('/', (req, res) => {
	validateInput(req.body, commonValidations).then(({errors, isValid}) =>{
	
	if(isValid){
		const {fullName, username, email, password, passwordConfirmation} = req.body;
		
		let newUser = User({
			fullName: fullName,
			username: username,
			email: email,
			password: password
		});
		
		addUser(newUser, (err, user) => {
			if(err){
				res.json({success: false, msg: "Registration failed"});
			}else{
				const newNotificationDB = Notification({
					userNotificationId: user._id
				});
				setNotificationDB(newNotificationDB, (err, notificationDB) => {
					if(err){
						res.status(500).json({msg: "Error"})
					}else{

						res.status(200).json({msg: "User registered"})
					}
				});
			}
		});
		
	}else{
		res.status(400).json(errors);
	}
	
	
	});
	
});

export default router;