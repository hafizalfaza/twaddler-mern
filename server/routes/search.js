import express from 'express';
import authenticate from '../middlewares/authenticate';
import {getUserBySearchQuery} from '../models/user';

const router = express.Router();


//Get search result
router.get('/str/:searchQuery', authenticate, (req, res) => {
	const searchQuery = req.params.searchQuery;
	getUserBySearchQuery(searchQuery, (err, user) => {
		if(err){
			res.status(500).json({msg: "Internal server error"});
		}else{
			res.status(200).json({user: user});
		}
	});
});

export default router;