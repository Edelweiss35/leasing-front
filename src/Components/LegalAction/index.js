import React, { Component } from "react";
import superagent from "superagent";
// import { Redirect } from "react-router-dom";
import "../../App.css";
import {Card, Form, H3, H4} from "../../Shared/styles"

class SecondForm extends Component {
  constructor(props) {
    super(props);
    const state = {
      email: localStorage.getItem("email"),
    };
    props.formValue.forEach((data, i) => {
      state[`${i}-action`] = data.action;
      state[`${i}-name`] = data.name;
      state[`${i}-reason`] = data.reason;  
    });
    this.state = state;
  }

  handleChange = event => {
    const elem = event.target;
    this.setState({
      [elem.name]: elem.value
    });
  };

  submitForm = event => {
    event.preventDefault();
    const payload = this.state;
    console.log(payload);
    superagent
      .post("http://104.196.119.240:8081/legal2")
      .set("Content-Type", "application/json")
      .send(payload)
      .then(res => {
        console.log(res);
        this.props.onSuccessfull();
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderField = (fieldData, i) => {
    const action = `${i}-action`;
    const reason = `${i}-reason`;
    const name = `${i}-name`;
    return (
      <div className="container-fluid" key={i}>
        <div className="row pt-2">
          <div className="col-md-4">
            <h3 className="text-center">{this.state[name]}</h3>
          </div>
         
          <div className="col-md-4 text-center">
            <input
              name={action}
              value={this.state[action]}
              onChange={this.handleChange}
              className="pl-2"
              required
            />
          </div>
           <div className="col-md-4 text-center">
            <input
              name={reason}
              value={this.state[reason]}
              onChange={this.handleChange}
              className="pl-2"
              required
            />
          </div>
        </div>
      </div>
    );
  };


  render() {
    return (
      <Card className="my-4" style={{ maxWidth: "1000px" }}>
        <Form
          style={{ maxWidth: "100%" }}
          onSubmit={this.submitForm}          
        >
          <H3 className="pt-3">Legal Position</H3>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4 text-center">
                <label>Name</label>
              </div>
              <div className="col-md-4 text-center">
                <label>Action</label>
              </div>
              <div className="col-md-4 text-center">
                <label>Reason</label>
              </div>
            </div>
          </div>
          {this.props.formValue.map(this.renderField)}
          <div className="text-center">
            <button className="btn btn-primary mt-4" type="submit">
              Save
            </button>
          </div>
        </Form>
      </Card>
    );
  }
}

export default SecondForm;
