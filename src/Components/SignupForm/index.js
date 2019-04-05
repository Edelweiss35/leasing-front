import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Signup from '../Signup'


class Signupform extends  Component {
  state = {
    isAuthenticated: false
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return token && token.length > 10;
  }

  handleSuccessfulSignup() {
    this.setState( {
      isAuthenticated: true
    });
  }

  render() {
    const isAlreadyAuthenticated = this.isAuthenticated();
    return (
      <div>
      { isAlreadyAuthenticated ? <Redirect to={{
        pathname: '/frontend/main'
      }}/> : (
      <Signup onSuccessfulSignup={this.handleSuccessfulSignup.bind(this)}/>
      )
      }
      </div>
      );
  }
}

export default Signupform;
