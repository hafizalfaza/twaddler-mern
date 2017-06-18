import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE, SET_INITIAL_POSTS, ADD_COMMENT_TO_INITIAL_POSTS, INJECT_POSTS_TO_NEWSFEED, REVEAL_COLLECTED_POSTS } from '../actions/types';
import findIndex from 'lodash/findIndex';
import shortid from 'shortid';

// Reducer for redux posts store
export default (state = { initialPosts: [], isFetchingPosts: true }, action = {}) => {
  switch (action.type) {
    case SET_INITIAL_POSTS:
      return {
        collectedPosts: [],
        initialPosts: action.initialPosts,
        collectedPostsCount: 0,
        isFetchingPosts: false,
      };
    case INJECT_POSTS_TO_NEWSFEED:
      if (state.collectedPosts) {
        return {
          collectedPosts: [
            ...action.recentPosts.recentPosts,
            ...state.collectedPosts,
          ],
          initialPosts: state.initialPosts,
          collectedPostsCount: state.collectedPostsCount + action.recentPosts.recentPosts.length,
        };
      } else {
        return {
          collectedPosts: [
            action.recentPosts.recentPosts,
          ],
          initialPosts: state.initialPosts,
          collectedPostsCount: state.collectedPostsCount + action.recentPosts.recentPosts.length,
        };
      }

    case ADD_COMMENT_TO_INITIAL_POSTS:
      const newArray = [];
      for (let i = 0; i < state.initialPosts.length; i++) {
        if (state.initialPosts[i]._id.toString() === action.data.postCommented[0]._id.toString()) {
          newArray.push(action.data.postCommented[0]);
        } else {
          newArray.push(state.initialPosts[i]);
        }
      }

      return {
        collectedPosts: state.collectedPosts,
        initialPosts: newArray,
        collectedPostsCount: state.collectedPostsCount,
      };

    case REVEAL_COLLECTED_POSTS:
      if (!state.initialPosts) {
        return {
          collectedPosts: [],
          initialPosts: [
            ...state.collectedPosts[0],
          ],
          collectedPostsCount: 0,
        };
      } else {
        return {
          collectedPosts: [],
          initialPosts: [
            ...state.collectedPosts,
            ...state.initialPosts,
          ],
          collectedPostsCount: 0,
        };
      }
    default: return state;
  }
};
