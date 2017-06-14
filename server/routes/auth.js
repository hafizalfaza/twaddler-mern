import express from 'express';
import {User, getUserByUsernameOrEmail} from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/database';

const router = express.Router();

//Token authentication

router.post('/', (req, res) => {
	const {identifier, password} = req.body;
	
	getUserByUsernameOrEmail(identifier, (err, user) => {
		if(err) throw err;
		if(user){
			if(bcrypt.compareSync(password, user.password)){
				const token = jwt.sign({
					id: user._id,
					user: user
				}, config.jwtSecret);
				res.json({token});
			}else{
				res.status(401).json({errors: {form: 'Invalid credentials'}});
			}
		}else{
			res.status(401).json({errors: {form: 'Invalid credentials'}});
		}
	});	
});

export default router;