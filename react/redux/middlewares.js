export const logger = getState => dispatch => action => {
  console.log(`执行了${action.type}`);
  return dispatch(action);
}

export const thunk = getState => dispatch => action => {
  if (typeof action === 'function') {
    console.log('thunk 拦截到异步操作了');
    return action(dispatch, getState);
  } else {
    console.log('thunk 拦截到同步操作了');
    return dispatch(action);
  }
}
