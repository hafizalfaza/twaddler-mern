import express from 'express';
import authenticate from '../middlewares/authenticate';
import validateInput from '../shared/validations/userPostValidations';
import {addCommentToDB, getInitialPostsByCurrentUser, getRecentPostsByCurrentUser, getPostsForProfile, addPostToDB, Post, getPostByPostId, addUserToPostLikes} from '../models/post';
import {getUserById, getUsernameById, getFollowingByCurrentUser, requestToFollow, getUserByUsername, resetUnreadNotifications, updateProfileData} from '../models/user';
import {addNotificationToDB, getNotificationsByUserId, incrementUnreadNotifications} from '../models/notification';
import {$,jQuery} from 'jquery';

const router = express.Router();



//User post update

router.post('/post', authenticate, (req, res) => {
	const user = req.currentUser._id;
	const {errors, isValid} = validateInput(req.body);	
	const text =  req.body.inputText;
	const charCount =  req.body.charCount;
	
	if(isValid){
		
		let newPost = Post({
			postedBy: user,
			text: text,
			charCount: charCount
		});
		
		addPostToDB(newPost, user, (err, post) => {
			if(err){
				res.status(500).json({success: false, msg: "Internal server error"});
			}else{
				res.status(200).json({post: post});
			}
		});
	}	
});



//Get initial posts for newsfeed

router.get('/timeline/initial', authenticate, (req, res) => {
	const currentUser = req.currentUser._id;	
	
	getFollowingByCurrentUser(currentUser, (err, queryResult) => {
		if(err){
			res.status(500).json({msg: 'Internal server error'});
		}else{
			const following = queryResult[0].following;
			following.push(currentUser);
			
			
			getUsernameById(following, (err, user) => {
				if(err){
					res.status(500).json({msg: "Error"});
				}else{
					
					getInitialPostsByCurrentUser(following, (err, initialPosts) => {
						if(err){
							res.status(500).json({success: false, msg: 'Something went wrong'});
						}else{
							if(!initialPosts){
								res.status(204).json({success: true, msg: 'No posts to display', initialPosts: initialPosts});
							}else{
								
								let userIdArrayForComments = [];
									for(let j=0; j<user.length; j++){
										for(let i=0; i<initialPosts.length; i++){
											
											if(user[j]._id.toString()==initialPosts[i].postedBy.toString()){
												initialPosts[i].postedBy=user[j].username;
												initialPosts[i].fullName=user[j].fullName;
												initialPosts[i].profilePic=user[j].profilePic;
											}
											
											let tempArray =[];
											
											for(let x=0; x<initialPosts[i].comments.length; x++){
												tempArray.push(initialPosts[i].comments[x].user)		
												
											}	
											
											
											userIdArrayForComments.push(tempArray);
											
										}
									}
							
								
							
							
								function loop(){
									let array = []
									for(let i=0; i<userIdArrayForComments.length; i++){
										if(userIdArrayForComments[i][0]){
											for(let j=0; j<userIdArrayForComments[i].length; j++){
												array.push(userIdArrayForComments[i][j])
											}
										}
									}
									return array;
								}	
																					
								
							
								getUsernameById(loop(), (err, username) => {
									if(err){
										
										res.status(500).json({msg: "error"});
										
									}else{	
										
										
										for(let i =0; i<initialPosts.length; i++){
											for(let j=0; j<initialPosts[i].comments.length; j++){
												for(let k=0; k<username.length; k++){
													 if(username[k]._id.toString()==initialPosts[i].comments[j].user.toString()){
														initialPosts[i].comments[j].user=username[k].username;
													}
												}
											}
										}
										

										let likedByArray=[];
				
									
									
										function likeLoop(){
											for(let a =0; a<initialPosts.length; a++){
		
												for(let b=0; b<initialPosts[a].likedBy.length; b++){
													
													likedByArray.push(initialPosts[a].likedBy[b]);	
												}														
											}
											return likedByArray;
										}
											
										function uniq_fast(f) {
											let seen = {};
											let out = [];
											let len = f.length;
											let g = 0;
											for(let h = 0; h < len; h++) {
												 let item = f[h];
												 if(seen[item] !== 1) {
													   seen[item] = 1;
													   out[g++] = item;
												 }
											}
											return out;
										}
											
										

										getUsernameById(uniq_fast(likeLoop()), (err, userData) => {
											if(err){
											
												 res.status(500).json({msg: "error"});
													
											}else{										
					
												
												for(let c=0; c<initialPosts.length; c++){
													
													if(initialPosts[c].likes!=0){
														for(let d=0; d<initialPosts[c].likedBy.length;d++){
															
															for(let e=0; e<userData.length; e++){
																if(initialPosts[c].likedBy[d].toString()==userData[e]._id.toString()){
																	initialPosts[c].likedBy[d]=userData[e].username
																}															
															}
															
															
														}
													}
											
												}
			
												 res.status(200).json({initialPosts: initialPosts});
												
													
											}
										});
	
										
									}
								});

							}			
						}
					});				

				}
			});			
			
					
		}
	});
	
	
});



//Get recent posts to inject

router.get('/timeline/recent/latestPost', authenticate, (req, res) => {
	const currentUser = req.currentUser._id;
	const latestPost = req.query.date	
	
	getFollowingByCurrentUser(currentUser, (err, queryResult) => {
		if(err){
			res.status(500).json({msg: 'Internal server error'});
		}else{
			const following = queryResult[0].following;
			following.push(currentUser);
			
			
			getUsernameById(following, (err, user) => {
				if(err){
					res.status(500).json({msg: "Error"});
				}else{
					
					getRecentPostsByCurrentUser(following, latestPost,(err, recentPosts) => {
						if(err){
							res.status(500).json({success: false, msg: 'Something went wrong'});
						}else{
							if(!recentPosts){
								res.status(204).json({success: true, msg: 'No posts to display', recentPosts: recentPosts});
							}else{
								
								let userIdArrayForComments = []
								
									for(let j=0; j<user.length; j++){
										for(let i=0; i<recentPosts.length; i++){
											if(user[j]._id.toString()==recentPosts[i].postedBy.toString()){
												recentPosts[i]["postedBy"]=user[j].username;
												recentPosts[i]["fullName"]=user[j].fullName;
												recentPosts[i]["profilePic"]=user[j].profilePic;
											}
											
											let tempArray =[];
											
											for(let x=0; x<recentPosts[i].comments.length; x++){
												tempArray.push(recentPosts[i].comments[x].user)		
												
											}	
											
											
											userIdArrayForComments.push(tempArray);
											
										}
									}
							
								
							
							
								function loop(){
									let array = []
									for(let i=0; i<userIdArrayForComments.length; i++){
										if(userIdArrayForComments[i][0]){
											for(let j=0; j<userIdArrayForComments[i].length; j++){
												array.push(userIdArrayForComments[i][j])
											}
										}
									}
									return array;
								}	
																					
								
							
								getUsernameById(loop(), (err, username) => {
									if(err){
										
										res.status(500).json({msg: "error"});
										
									}else{	
										
										
										for(let i =0; i<recentPosts.length; i++){
											for(let j=0; j<recentPosts[i].comments.length; j++){
												for(let k=0; k<username.length; k++){
													 if(username[k]._id.toString()==recentPosts[i].comments[j].user.toString()){
														recentPosts[i].comments[j].user=username[k].username;
													}
												}
											}
										}
										

										let likedByArray=[];
				
									
									
										function likeLoop(){
											for(let a =0; a<recentPosts.length; a++){
		
												for(let b=0; b<recentPosts[a].likedBy.length; b++){
													
													likedByArray.push(recentPosts[a].likedBy[b]);	
												}														
											}
											return likedByArray;
										}
											
										function uniq_fast(f) {
											let seen = {};
											let out = [];
											let len = f.length;
											let g = 0;
											for(let h = 0; h < len; h++) {
												 let item = f[h];
												 if(seen[item] !== 1) {
													   seen[item] = 1;
													   out[g++] = item;
												 }
											}
											return out;
										}
											
										

										getUsernameById(uniq_fast(likeLoop()), (err, userData) => {
											if(err){
											
												 res.status(500).json({msg: "error"});
													
											}else{										
					
												
												for(let c=0; c<recentPosts.length; c++){
													
													if(recentPosts[c].likes!=0){
														for(let d=0; d<recentPosts[c].likedBy.length;d++){
															
															for(let e=0; e<userData.length; e++){
																if(recentPosts[c].likedBy[d].toString()==userData[e]._id.toString()){
																	recentPosts[c].likedBy[d]=userData[e].username
																}															
															}
															
															
														}
													}
											
												}
			
												 res.status(200).json({recentPosts: recentPosts});
												
													
											}
										});
	
										
									}
								});

							}			
						}
					});				

				}
			});			
			
					
		}
	});
	
	
});


//Post likes

router.post('/timeline/likes', authenticate, (req, res) => {
	const user = req.currentUser._id;
	const id = req.body.likedId;
	const liked = req.body.liked;
	const triggeredBy = req.body.triggeredBy;
	
	addUserToPostLikes(user, id, liked, (err, postLiked) => {
		if(err){
			res.status(500).json({msg: 'error'});
		}else{
			
			if(!liked){
				const additionalId = ''
				const activityType = "POST_LIKE";

				addNotificationToDB(postLiked, triggeredBy, activityType, additionalId, (err, notification) => {
					if(err){
						res.status(500).json({msg: "Error"})
					}else{
						
					}
				});
			}
			
			
			
			let likedBy = postLiked[0].likedBy;
			
			
			function userExists(){
				for(let i=0; i<likedBy.length; i++){
					if(likedBy[i] == user){
						return true
					}
				}
			}			
							
			if(userExists()){
				likedBy.push(user);
			}	
			
			
			getUsernameById(likedBy, (err, user) => {
				if(err){
					res.status(500).json({msg: "Error"})
				}else{
					// console.log(user);
						let postLikedObj;
						function translationLoop(){
							if(user.length!=0){
								for(let i=0; i<likedBy.length; i++){
									for(let j=0; j<user.length;j++){
										if(user[j]._id.toString() == likedBy[i].toString()){
											postLiked[0].likedBy[i]=user[i].username
											postLiked[0]["triggeredBy"]=triggeredBy
											postLiked[0]["fullName"]=user[j].fullName
											postLiked[0]["profilePic"]=user[j].profilePic
											postLikedObj ={_id: postLiked[0]._id, postedBy: postLiked[0].postedBy,text: postLiked[0].text, likedBy: postLiked[0].likedBy, likes: postLiked[0].likes, commentsCount: postLiked[0].commentsCount, comments: postLiked[0].comments, charCount: postLiked[0].charCount, postDate: postLiked[0].postDate, triggeredBy: triggeredBy}
										}
									}										
								}
							}else{
								postLikedObj = postLiked[0];
							}
							return postLikedObj;
						}
							
						
					res.status(200).json({postLiked: translationLoop()});	
					
				}
			});
			
	
		}		
	});
});


//Follow user request

router.post('/follow', authenticate, (req, res) => {
	const userRequesting = req.currentUser._id;
	const userRequested = req.body.userRequested;	
	const following =  req.body.following;
	
	const activityType = "FOLLOW";
	const additionalId = '';
	const userFollowed = {userRequested: userRequested}		
		addNotificationToDB(userFollowed, userRequesting, activityType, additionalId, (err, notification) => {
			if(err){
				res.status(500).json({msg: "Error"})
			}else{
				return true;
			}
		});

	
	requestToFollow(userRequesting, userRequested, following, (err, userRequested) => {
		if(err){
			res.status(500).json({success: false, msg: 'Internal server error'});
		}else{
			res.status(200).json({success: true, userRequested: userRequested, triggeredBy: userRequesting});
		}
	});
});


//User authentication

router.post('/auth', authenticate, (req, res) => {
	res.json({currentUser: req.currentUser.username});
});


//Get user profile data

router.get('/profile/:username', (req, res) => {
	const username = req.params.username;

	getUserByUsername(username, (err, user) => {
		if(err){
			res.status(500).json({status: "failed"});
		}else{
			const userId = user._id
			getPostsForProfile(userId, (err, posts) => {
				if(err){
					res.status(500).json({msg: "error"})
				}else{
					
					const commentsUserIdArray = []

					for(let i = 0; i < posts.length; i++){
						for(let j = 0; j < posts[i].comments.length; j++){
							commentsUserIdArray.push(posts[i].comments[j].user)
						}
					}
					
					getUsernameById(commentsUserIdArray, (err, username) => {
						if(err){
							res.status(500).json({msg: 'error'})
						}else{
							
							for(let i = 0; i < posts.length; i++){
								for(let j = 0; j < posts[i].comments.length; j++){
									for(let k = 0; k < username.length; k++){
										if(posts[i].comments[j].user.toString()==username[k]._id){
											posts[i].comments[j].user=username[k].username;
										}
									}
								}
							}						
							
							
							for(let i = 0; i < posts.length; i++){
								posts[i].postedBy = req.params.username;
								posts[i].fullName = user.fullName;
								posts[i].profilePic = user.profilePic;
							}
							res.status(200).json({userInfo: user, posts: posts})
								
						}
					});
				}
			});
		}
	});
});	

//Get notifications

router.get('/notifications', authenticate, (req, res) => {
	
	const userId = req.currentUser._id
	
	getNotificationsByUserId(userId, (err, notifications) => {
		if(err){
			res.status(500).json({msg: "Error"})
		}else{
			
			const likeNotifications = notifications[0].like;
			const followNotifications = notifications[0].follow;
			const commentNotifications = notifications[0].comment;
			
			let notificationsArray = []
			
			
			let likedPostIdArray = []
			
			for(let i=0; i<likeNotifications.length; i++){
				likedPostIdArray.push(likeNotifications[i].postId)
			}
			

			getPostByPostId(likedPostIdArray, (err, posts) =>{
				if(err){
					res.status(500).json({msg: "Error"})
				}else{	

					for(let x=0; x<posts.length; x++){
						for(let y=0; y<likeNotifications.length; y++){
							if(posts[x]._id.toString()==likeNotifications[y].postId.toString()){
								likeNotifications[y]["postData"]=posts[x];
							}
						}							
					}


					for(let i=0; i<likeNotifications.length; i++){
						notificationsArray.push(likeNotifications[i])
					}
					
	
					let commentedPostIdArray = []
			
					for(let i=0; i<commentNotifications.length; i++){
						commentedPostIdArray.push(commentNotifications[i].postId)
					}


					getPostByPostId(commentedPostIdArray, (err, posts) =>{
						if(err){
							res.status(500).json({msg: "Error"})
						}else{	
							
						
						let comparisonArray = commentNotifications;
						
							
								for(let x=posts.length-1; x>=0; x--){
									for(let y=comparisonArray.length-1; y>=0; y--){
										
										if(posts[x]._id.toString()==commentNotifications[y].postId.toString()){
											commentNotifications[y]["postData"]=posts[x];
											
											for(let z=posts[x].comments.length-1; z>=0; z--){
												if(posts[x].comments[z].user.toString()==comparisonArray[y].triggeredBy.toString() && !comparisonArray[y].duplicate){
													
													commentNotifications[y]['comment']=posts[x].comments[z].comment;
																						
													posts[x].comments.splice(z, 1);
													comparisonArray[y]["duplicate"]=true
												}
											}
											
											
											
										}
										
										
									}
								}
						
								

							
							
							for(let i=0; i<commentNotifications.length; i++){
								notificationsArray.push(commentNotifications[i])
							}
					

							for(let j=0; j<followNotifications.length; j++){
								notificationsArray.push(followNotifications[j])
							}	

							let userIdArray = []
							
							for(let i=0; i<notificationsArray.length; i++){
								userIdArray.push(notificationsArray[i].triggeredBy);
							}
							
							
							
							getUsernameById(userIdArray, (err, user) => {
								if(err){
									res.status(500).json({msg: "Error"})
								}else{
									for(let i=0; i<user.length; i++){
										for(let j=0; j<notificationsArray.length; j++){
											if(notificationsArray[j].triggeredBy.toString()==user[i]._id.toString()){
												notificationsArray[j]["triggeredBy"]=user[i].username
												notificationsArray[j]["fullName"]=user[i].fullName
												notificationsArray[j]["profilePic"]=user[i].profilePic
											}	
											
										}
																	
									}

									function compare(a,b) {
									  if (a.date < b.date)
										return 1;
									  if (a.date > b.date)
										return -1;
									  return 0;
									}
							
									notificationsArray.sort(compare);
									
									
									
									const notificationsData = {notifications: notificationsArray, unreadNotifications: req.currentUser.unreadNotifications}
									
									
									
									res.status(200).json({notifications: notificationsData})
								}
							});

						}
					});
				}
			});	
			
		}
	});
})


//Add comment to post

router.post('/post/comment', authenticate, (req, res) => {
	const userId = req.currentUser._id;
	const postId = req.body.postId;
	const comment = req.body.comment;
	const commentId = Math.random().toString(36).substring(7);
	const commentObj = {commentId: commentId, user: userId, date: new Date().toISOString(), comment: comment}
	
	const commentData = {postId: postId, commentData: commentObj}

	addCommentToDB(commentData, (err, postCommented) => {
		if(err){
			res.status(500).json({msg: "Error"})
		}else{
			getUserById(postCommented[0].postedBy, (err, user) => {
				if(err){
					res.status(500).json("error")
				}else{
					
					if(userId.toString()==postCommented[0].postedBy.toString()){
						postCommented[0].postedBy=user.username
						postCommented[0].fullName=user.fullName
						postCommented[0].profilePic=user.profilePic
						let commenterIdArray = []
						
						for(let i=0;i<postCommented[0].comments.length;i++){
							commenterIdArray.push(postCommented[0].comments[i].user)
						}
						
						
						getUsernameById(commenterIdArray, (err, username)=> {
							
							if(err){
								res.status(500).json({msg: "error"})
							}else{
								
								
								
								for(let i=0; i< postCommented[0].comments.length; i++){
									for(let j=0; j<username.length; j++){
										if(postCommented[0].comments[i].user.toString()==username[j]._id.toString()){
												postCommented[0].comments[i].user=username[j].username
										}
										
										
									}
									
								}

								res.status(200).json({postCommented: postCommented, recentComment: commentObj})				
								
							}
							
							
						})

					}else{
						

						postCommented[0].postedBy=user.username
						let commenterIdArray = []
						
						for(let i=0;i<postCommented[0].comments.length;i++){
							commenterIdArray.push(postCommented[0].comments[i].user)
						}
						
						
						getUsernameById(commenterIdArray, (err, username)=> {
							
							if(err){
								res.status(500).json({msg: "error"})
							}else{
								
								
								
								for(let i=0; i< postCommented[0].comments.length; i++){
									for(let j=0; j<username.length; j++){
										if(postCommented[0].comments[i].user.toString()==username[j]._id.toString()){
												postCommented[0].comments[i].user=username[j].username
										}
										
										
									}
									
								}

								const triggeredBy = userId;
					
								const activityType = "POST_COMMENT";
								
								if(user.username==postCommented[0].postedBy){
									postCommented[0].postedBy=user._id
									postCommented[0]["userId"]=user._id
								}
								
								
								addNotificationToDB(postCommented, triggeredBy, activityType, commentId, (err, notification) => {
									if(err){
										res.status(200).json({msg: "Notification not added"})
									}else{
										
										postCommented[0].postedBy=user.username
										postCommented[0].fullName=user.fullName
										postCommented[0].profilePic=user.profilePic
										res.status(200).json({postCommented: postCommented, userId: user._id, triggeredBy: triggeredBy, recentComment: commentObj})
									}
								});	
								
							}
							
						})
		
					}
	
				}
			});
				
		}
	});
});



//Reset unread notifications

router.post('/notifications/reset-unread', authenticate, (req, res) => {
	const userId = req.currentUser._id;
	
	resetUnreadNotifications(userId, (err, status) => {
		if(err){
			res.status(500).json({msg: "error"})
		}else{
			res.status(200).json({msg: "ok"})
			// console.log(status);
		}
	});
});

router.post('/profile/update', authenticate, (req, res) => {
	const userId = req.currentUser._id;
	const newProfileData = req.body;
	
	updateProfileData(userId, newProfileData, (err, userData) => {
		if(err){
			res.status(500).json({msg: "error"})
		}else{
			res.status(200).json({userData: userData})
		}
	});
});

export default router;