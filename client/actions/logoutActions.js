import { RESET_REDUX_STATE } from './types';

// Reset redux store
export function resetReduxState() {
  return {
    type: RESET_REDUX_STATE,
  };
}
