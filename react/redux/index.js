export function createStore(reducer, enhancer) {

  if (enhancer) {
    return enhancer(createStore)(reducer);
  }

  let currentState = undefined;
  const listeners = new Set();

  const getState = () => {
    return currentState;
  }

  const subscribe = (listener) => {
    listener && listeners.add(listener);
  }

  const dispatch = (action) => {
    currentState = reducer(currentState, action);
    listeners.forEach(listener => listener());
  }

  dispatch({type: "@INIT/REDUX"});

  return {
    getState,
    dispatch,
    subscribe
  }
}

export function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args);
    let dispatch = store.dispatch;
    let apis = {
      getState: store.getState,
      dispatch: dispatch
    }
    const chain = (middlewares || []).map(middleware => {
      return middleware(apis);
    });
    dispatch = compose(...chain)(dispatch);
    return {
      ...store,
      dispatch
    };
  };
}

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
