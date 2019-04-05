import React, { Component } from "react";
import superagent from "superagent";
import { NavLink } from "react-router-dom";
import ArrowData from "../../Shared/ArrowDataComponent.jsx";
import {
  LogInCard,
  Form,
  Button,
  H3,
  H4,
  styledH3
} from "../../Shared/styles.js";
import APIPath from '../Api'


class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
        error: "",
        showPassword:false
    };
  }
  handleUsernameChanged(event) {
    this.setState({ username: event.target.value });
  }
  handlePasswordChanged(event) {
    this.setState({ password: event.target.value });
  }
  submitForm(event) {
    event.preventDefault();
    const payload = {
      username: this.state.username,
      password: this.state.password
    };
    superagent
      .post(APIPath + "/api/v1/login/")
      .set("Content-Type", "application/json")
      .send(payload)
      .then(res => {
        localStorage.setItem("token", res.body.token);
        localStorage.setItem("username" , this.state.username);
        this.props.onSuccessfulLogin();
      })
      .catch(err => {
        this.setState({
          error: "Authentication Failed"
        });
      });
      

  }
    hidePassword(){
        this.setState({showPassword : false})
    }
    showPassword(){
    this.setState({showPassword : true})
    }
  render() {
    return (
      <div>
        {/* <H4 className="text-white">
          Construct a Leasing Negotiation Table in less than 30 Seconds.
        </H4> */}
        <LogInCard>
          <Form className="p-3" onSubmit={this.submitForm.bind(this)} style={{marginTop:"140px"}}>
            <p style={{fontSize:'44px',textAlign:'center'}}>Sign In</p>
            <div className="input-group mb-4">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="material-icons">account_circle</i>
                </div>
              </div>
              <input
                type="text"
                max-length="10"
                className="form-control"
                value={this.state.username}
                onChange={this.handleUsernameChanged.bind(this)}
                placeholder="Username"
                required
            />        
            </div>
            <div className="input-group mb-4">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="material-icons">vpn_key</i>
                </div>
              </div>
              <input
        type={!this.state.showPassword?"password":"text"}
                className="form-control"
                value={this.state.password}
                name="password"
                placeholder="Password"
                onChange={this.handlePasswordChanged.bind(this)}
                required
            />
            { !this.state.showPassword ?(
                    <div className="input-group-apppend">
                    <div className="input-group-text">
                    <a href="javascript:;" onClick={this.showPassword.bind(this)}>
                    <i className="material-icons">visibility</i>
                    </a>
                    </div>
                    </div>):
              (<div className="input-group-apppend">
               <div className="input-group-text">
               <a href="javascript:;" onClick={this.hidePassword.bind(this)}>
               <i className="material-icons">visibility_off</i>
               </a>
               </div>
               </div>)}
        
        </div>
            <div style={{ marginLeft : '10%' }}>
            <NavLink to="/frontend/ForgotLoginDetails">{"Can't access your account ?"}</NavLink>
            </div>    
            <Button className="btn btn-lg btn-primary" type="submit">
              Sign In
            </Button>
            <p className="text=center" style={{ color: "red" }}>
              {this.state.error}
            </p>
            <p className="text-center" style={{ fontSize: "24px" }}>
              <NavLink to="/frontend/signup">Yet to Signup?</NavLink>
            </p>
          </Form>
          <svg
            className="rocks"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              className="svg--sm"
              fill="red"
              points="0,0 30,100 65,21 90,100 100,75 100,100 0,100"
            />
            <polygon
              className="svg--lg"
              fill="red"
              points="0,0 15,100 33,21 45,100 50,75 55,100 72,20 85,100 95,50 100,80 100,100 0,100"
            />
          </svg>
          <svg className="gradient">
            <defs>
              <linearGradient id="grad">
                <stop offset="0" stopColor="#97ABFF" />
                <stop offset="1" stopColor="#123597" />
              </linearGradient>
            </defs>
          </svg>
        </LogInCard>
        {/* <div className="row p-0 text-center text-white data-row">
          <div className="col-sm-4">
            <img src="/assets/document.svg" />
            <h5 className="my-4">
              Our Machine Learning Analysis, Your Leasing Contracts
            </h5>
          </div>
          <div className="col-sm-4">
            <img src="/assets/clock.svg" />
            <h5 className="my-4">Review takes less than a minute</h5>
          </div>
          <div className="col-sm-4">
            <img src="/assets/cloud.svg" />
            <h5 className="my-4">Download a negotiation table</h5>
          </div>
        </div> */}
        {/* <ArrowData /> */}
      </div>
    );
  }
}

export default Login;
