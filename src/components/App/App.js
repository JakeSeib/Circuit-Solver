import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'

// import AuthenticatedRoute from '../AuthenticatedRoute/AuthenticatedRoute'
import AutoDismissAlert from '../AutoDismissAlert/AutoDismissAlert'
import Home from '../Home/Home'
import Circuit from '../Circuits/Circuit/Circuit'

// unused auth routes and components

// import Header from '../Auth/Header/Header'
// import SignUp from '../Auth/SignUp/SignUp'
// import SignIn from '../Auth/SignIn/SignIn'
// import SignOut from '../Auth/SignOut/SignOut'
// import ChangePassword from '../Auth/ChangePassword/ChangePassword'

// <Route path='/sign-up' render={() => (
//   <SignUp msgAlert={this.msgAlert} setUser={this.setUser} />
// )} />
// <Route path='/sign-in' render={() => (
//   <SignIn msgAlert={this.msgAlert} setUser={this.setUser} />
// )} />
// <AuthenticatedRoute user={user} path='/sign-out' render={() => (
//   <SignOut msgAlert={this.msgAlert} clearUser={this.clearUser} user={user} />
// )} />
// <AuthenticatedRoute user={user} path='/change-password' render={() => (
//   <ChangePassword msgAlert={this.msgAlert} user={user} />
// )} />

class App extends Component {
  constructor () {
    super()

    this.state = {
      msgAlerts: []
    }
  }

  msgAlert = ({ heading, message, variant }) => {
    this.setState({ msgAlerts: [...this.state.msgAlerts, { heading, message, variant }] })
  }

  render () {
    const { msgAlerts } = this.state

    return (
      <Fragment>
        {msgAlerts.map((msgAlert, index) => (
          <AutoDismissAlert
            key={index}
            heading={msgAlert.heading}
            variant={msgAlert.variant}
            message={msgAlert.message}
          />
        ))}
        <main className='container'>
          <Switch>
            <Route path='/species' render={() => (
              <p>Under Construction</p>
            )} />
            <Route path='/circuits' render={() => (
              <Circuit msgAlert={this.msgAlert} />
            )} />
            <Route path='/ship-logs' render={() => (
              <p>Under Construction</p>
            )} />
            <Route path='/video-logs' render={() => (
              <p>Under Construction</p>
            )} />
            <Route path='/diary' render={() => (
              <p>Under Construction</p>
            )} />
            <Route path='/' render={() => (
              <Home />
            )} />
          </Switch>
        </main>
      </Fragment>
    )
  }
}

export default App
