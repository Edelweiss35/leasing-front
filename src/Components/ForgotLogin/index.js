import React, { Component } from "react";
import superagent from "superagent";
import ArrowData from "../../Shared/ArrowDataComponent.jsx";
import { LogInCard, Form, Button, H3, H4 } from "../../Shared/styles.js";
import APIPath from '../Api';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';


class ForgotLogin extends Component {
    constructor() {
    super();
        this.state = {
            username_email : "",
        error: new Object()
    };
  }

    handleUsernameChanged(event) {
        this.setState({ username_email: event.target.value });
    }

    submitForm(event) {
        event.preventDefault();
        const payload = {
            username: this.state.username_email
        };
        superagent
            .post(APIPath + "/api/v1/forgot-login/")
            .set("Content-Type", "application/json")
            .send(payload)
            .then(res => {
                // window.location.href = '/';
            })
            .catch(err => {
                console.log('hello');
                Alert.warning('User Not Found', {
                    position: 'top-right',
                    effect: 'scale',
                    onShow: function () {
                       
                    },
                    beep: false,
                    timeout: 'none',
                    offset: 100
                });
                this.setState({
                    error: "User Not Found heer"                    
                });
            });
    }

  render() {
      return (
             
            <div style={{marginTop:'10%'}}> 

              <div>
              <span>
              {this.props.children}
              </span>
              <Alert stack={{limit: 3}} />
              </div>
          
        <LogInCard>
            <Form className="p-3" onSubmit={this.submitForm.bind(this)}>
            <p style={{color:'black',textTransform:'CAPITALIZE',fontSize:'37px',textAlign:'center'}}>{"Can't access your account?"}</p>
            <div className="input-group mb-4">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  <i className="material-icons">account_circle</i>
                </span>
              </div>
              <input
                type="text"
                name="username"
                className="form-control"
                value={this.state.username_email}
                onChange={this.handleUsernameChanged.bind(this)}
                placeholder="Username / Email"
            />
            </div>
            {this.state.error.username?<ul><li style={{textAlign:'center', color:'red', margin:'0px', padding:'0px', textAlign:'left'}}>{this.state.error.username[0]}</li></ul>:''} 
            
            <Button className="btn btn-lg btn-primary" type="submit">
               Send
            </Button>
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
        <div className="row p-0 text-center text-white data-row">
          <div className="col-md-4">
            <img src="/assets/document.svg" />
            <h5 className="my-4">
              Our Machine Learning Analysis, Your Leasing Contracts
            </h5>
          </div>
          <div className="col-md-4">
            <img src="/assets/clock.svg" />
            <h5 className="my-4">Review takes less than a minute</h5>
          </div>
          <div className="col-md-4">
            <img src="/assets/cloud.svg" />
            <h5 className="my-4">Download a negotiation table</h5>
          </div>
        </div>
        <ArrowData />
      </div>
    );
  }
}

export default ForgotLogin;
