import React, { Component } from 'react';
import { getLoggedInUser, logout } from './auth';
import Chat from './chat';
import Login from './login';
import NavBar from './nav-bar';

class App extends Component {
  state = { user: getLoggedInUser() };

  handleLogin(user) {
    this.setState({ user });
  }

  handleLogout() {
    logout();
    this.setState({ user: null });
  }

  render() {
    const { user } = this.state;
    if (!user) {
      return <Login onLogin={this.handleLogin.bind(this)} />;
    }
    return (
      <div>
        <NavBar onLogout={this.handleLogout.bind(this)} />
        <Chat user={user} />
      </div>
    );
  }
}

export default App;
