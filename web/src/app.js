import React, { PropTypes } from 'react';
import { Fragment } from 'redux-little-router';
import { connect } from 'react-redux'
import Home from './containers/Home'
import Signup from './containers/Signup'
import Navbar from './components/Navbar'
import { changeActiveScreen } from './store/actions/ui'

const App = (props) => {
  const { router, changeActiveScreen, activeScreen } = props
  return (
    <div>
      <Fragment forRoute='/'>
        <Navbar 
          changeActiveScreen={changeActiveScreen}
          activeScreen={activeScreen}
        />
        {
          router.pathname === "/" &&
          <Home />
        }
        <div>
          <Fragment forRoute='/signup'><Signup /></Fragment>
        </div>
      </Fragment>
    </div>
  );
};

App.propTypes = {
  router: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  return {
    activeScreen: state.railway.ui.get('activeScreen')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeActiveScreen: (screen) => {dispatch(changeActiveScreen(screen))}
  }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppContainer