import { GET_USER_INFORMATION, SET_PROFILE_DATA, UPDATE_PROFILE_DATA, ADD_COMMENT_TO_PROFILE_POSTS } from '../actions/types';

export default(state = [], action = {}) => {
  switch (action.type) {
    case SET_PROFILE_DATA:
      return action.data;
    case UPDATE_PROFILE_DATA:
      const postsArray = [];
      for (let i = 0; i < state.posts.length; i++) {
        postsArray.push({
          ...state.posts[i],
          fullName: action.newProfileData.fullName,
          bio: action.newProfileData.bio,
          profilePic: action.newProfileData.profilePic,
        });
      }
      return {
        userInfo: {
          ...state.userInfo,
          fullName: action.newProfileData.fullName,
          bio: action.newProfileData.bio,
          profilePic: action.newProfileData.profilePic,
        },
        posts: postsArray,
      };
    case ADD_COMMENT_TO_PROFILE_POSTS:
      const newArray = [];
      for (let i = 0; i < state.posts.length; i++) {
        if (state.posts[i]._id.toString() === action.data.postCommented[0]._id.toString()) {
          newArray.push(action.data.postCommented[0]);
        } else {
          newArray.push(state.posts[i]);
        }
      }

      return {
        ...state,
        posts: newArray,
      };
    default: return state;
  }
};
