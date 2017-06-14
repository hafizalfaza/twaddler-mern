export default function socketEvents(io){
	
	const connections = [];
	const users =[];
	const usernameSocketPair = []
	
	
	//Initialization of socket connection
	io.on('connection', (socket) => {
	
		//Connect a socket for new user
		socket.on('new-user', (username) => {
			if(users[0]){				
				
				let isExistingUser=false;
				for(let i=0; i<users.length; i++){
					if(username===users[i].username){
						users[i].socket.push(socket);
						const socketUsername = socket.id +'@'+ username;
						usernameSocketPair.push(socketUsername);
						
						console.log(username +" already connected, socket added with a new ID: "+ socket.id)
						console.log(users[i].username+"'s connections:" + users[i].socket.length);
						console.log("Users connected: "+ users.length);
						isExistingUser=true;
					}
				}
				
				//Existing user exception
				if(!isExistingUser){
					let newUser = {username: username, socket: [socket]}
					users.push(newUser);
					console.log(username + " is connected with socket-ID: " + socket.id);
					const socketUsername =  socket.id +'@'+ username;
					usernameSocketPair.push(socketUsername);
					console.log("Users connected: "+ users.length);					
				}			
				
			}else{
				let newUser = {username: username, socket: [socket]}
				users.push(newUser);
				console.log(username + " is connected with socket-ID: " + socket.id);			
				const socketUsername =  socket.id +'@'+ username;
				usernameSocketPair.push(socketUsername);
				console.log("Users connected: "+ users.length);
			}			
		});
		
		//Send real-time notification for online user
		socket.on('send-notification', (notificationData) => {
			
			//Like notification
			if(notificationData.postLiked){
				for(let x=0; x<users.length; x++){
					if(notificationData.postLiked.postedBy.toString()==users[x].username.toString()){
						if(notificationData.postLiked.triggeredBy){
							for(let y=0; y<users[x].socket.length; y++){
								if(notificationData.postLiked.triggeredBy.toString()!=users[x].username.toString()){
									users[x].socket[y].emit('receive-notification', notificationData);
								}else{
									return null;
								}						
							}
						}else{
							return null;
						}						
					}
				}
			}
			
			//Comment notification
			if(notificationData.postCommented){
				if(notificationData.userId){
					for(let x=0; x<users.length; x++){
						if(notificationData.userId.toString()==users[x].username.toString()){
							if(notificationData.triggeredBy){
								for(let y=0; y<users[x].socket.length; y++){
									if(notificationData.triggeredBy.toString()!=users[x].username.toString()){
										users[x].socket[y].emit('receive-notification', notificationData);
									}else{
										return null;
									}						
								}
							}
						}
					}
				}				
			}
			
			
			//Follow notification
			if(notificationData.userRequested){
				for(let x=0; x<users.length; x++){
					if(notificationData.userRequested[0]._id.toString()==users[x].username.toString()){
						for(let y=0; y<users[x].socket.length; y++){
							if(notificationData.triggeredBy.toString()!=users[x].username.toString()){
								users[x].socket[y].emit('receive-notification', notificationData);
							}else{
								return null;
							}						
						}
					}
				}
			}
			
		});				
		
		
		//Disconnect socket
		socket.on('disconnect', () => {
			if(users.length!==0){
				for(let i=0; i<usernameSocketPair.length; i++){
					if(socket.id===usernameSocketPair[i].substring(0,20)){
						const username= usernameSocketPair[i].substring(21);
						for(let j=0; j<users.length; j++){
							if(users[j].username===username){
								let userDisconnected;
								for(let k=0; k<users[j].socket.length; k++){
									if(users[j].socket[k]===socket){
										let socketIndex = users[j].socket.indexOf(socket)
										users[j].socket.splice(socketIndex, 1);
										if(users[j].socket.length==0){
											userDisconnected=true;
										}
										console.log("A socket is disconnected");
										console.log("Users connected: "+ users.length);
									};
								}
								if(userDisconnected){
									users.splice(j, 1);
									console.log(username+" has just left the site...");
									console.log("Users connected: "+ users.length);
								}								
							}
						}
					}
				}
			}else{
				console.log("No user connected");
			}
			
			
			
		});
	});	
}