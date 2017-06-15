import { SET_SOCKET_STATUS } from './types';

// Set socket status in redux store
export function setSocketToEstablished() {
  return {
    type: SET_SOCKET_STATUS,
  };
}
