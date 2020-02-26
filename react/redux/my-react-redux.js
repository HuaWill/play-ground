import React from 'react';

const ReduxContext = React.createContext();

export const connect = (
  mapStateToProps = state => state,
  mapDispatcherToProps
) => WrappedComponent => {
  return class extends React.Component {

    static contextType = ReduxContext;

    constructor(props) {
      super(props);
      this.state = {
        mergedProps: {}
      };
    };

    componentDidMount() {
      const {subscribe} = this.context;
      this.update();
      subscribe(() => {
        this.update();
      });
    };

    render() {
      return <WrappedComponent {...this.state.mergedProps} />;
    }

    update() {
      const {getState, dispatch} = this.context;
      /**
       * mapStateToProps
       * state => {
       *   xx: state.xx
       * }
       */
      let stateProps = mapStateToProps(getState());
      let dispatchProps;

      /**
       * mapDispatcherToProps
       * (dispatch) => {
       *   return {
       *    xx: dispatch({action: xxx})
       *   }
       * }
       */
      if (typeof mapDispatcherToProps === 'function') {
        dispatchProps = mapDispatcherToProps(dispatch);
      }
      /**
       * mapDispatcherToProps
       * {
       *    xx: () => {action: xxx}
       * }
       */
      else if (typeof mapDispatcherToProps === 'object') {
        dispatchProps = {}
        // can use bindActionCreators from redux
        Object.keys(mapDispatcherToProps).forEach(key => {
          dispatchProps[key] = () => {
            dispatch(mapDispatcherToProps[key]());
          }
        });
      }
      // pass nothing, add store.dispatch by default
      else {
        dispatchProps = {dispatchProps};
      }

      this.setState({
        mergedProps: {
          ...stateProps,
          ...dispatchProps
        }
      });
    }
  };
}

export class Provider extends React.Component {
  render() {
    return (
      <ReduxContext.Provider value={this.props.store}>
        {this.props.children}
      </ReduxContext.Provider>
    );
  }
}
