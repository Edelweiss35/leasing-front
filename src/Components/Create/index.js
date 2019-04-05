import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import superagent from "superagent";
import { Card, Form, H3, H4 } from "../../Shared/styles";
import "../../App.css";
import APIPath from "../Api";


class Create extends  Component {
  constructor() {
    super();
    this.state = {
      text : "Next",
      expand: true,
      second: true,
      name: '',
      description: '',
      tag: '',
      selectedFile: null,
      create: 'Create',
      disabled: false,
      last: true
    };
  }
fileChangedHandler = event => {
    this.setState({ selectedFile: event.target.files[0] });
  };
  submitFormfirst(event) {
    event.preventDefault();
    this.setState ({
      expand: false
    });
  }
  submitFormsecond(event) {
    event.preventDefault();
    this.setState ({
      second: false
    });
  }
  handleChange = event => {
    const elem = event.target;
    this.setState({
      [elem.name]: elem.value
    });
    console.log(this.state.name);
    console.log(this.state.description);
  }

  submitForm = event => {
    event.preventDefault();
    this.setState({
      disabled: true,
      create: "Creating"
    });
    let form = new FormData();
    form.append("name", this.state.name);
    form.append("description", this.state.description);
    form.append("tag", this.state.tag);
    form.append("selectedFile", this.state.selectedFile);

    console.log(form);
    superagent
      .post(APIPath + "/submit")
      .send(form)
      .then(res => {
        console.log(res);
        this.setState({
          disabled: false,
          create: "Created",
          last: false
        });
      })
      .catch(err => {
        console.log("err", err);
      });
  };
  render() {
    const isExpand = this.state.expand;
    const isSecond = this.state.second;
    const isLast = this.state.last;
    return (
      <div className="pt-5">
      <Card className="my-4">
      { isLast ? (
        <div>
                <Form  className="pt-4">
                  <H3>Create Model</H3>
                  { isExpand ? (
                    <div>
                  <label>Model Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter Model Name"
                    value={this.state.name}
                    onChange={this.handleChange}
                   
                  />
                  <label>Enter Model Description</label>
                  <textarea
                    type="text"
                    name="description"
                    className="form-control"
                    placeholder="Enter Description"
                    value={this.state.description}
                    onChange={this.handleChange}
                    
                  />
                  <label>Model Tags</label>
                  <input
                    type="text"
                    name="tag"
                    className="form-control"
                    placeholder="Enter Tags"
                    value={this.state.tag}
                    onChange={this.handleChange}
                  />
                  <br/>
                  <button
                    className="btn btn-primary btn-block"
                    type="submit"
                    onClick={this.submitFormfirst.bind(this)}
                  >
                    Next
                  </button>
                  
                  </div>
                  ) : (
                  <div>
                  {isSecond ? (
                    <div className="text-center">
                    
                <span className="btn btn-success btn-file ">
                    Upload DataType
                    <input
                      type="file"
                      className="form-control-file border"
                      onChange={this.fileChangedHandler}
                      id="upload"
                    />
                  </span>
                  <br/>
                   <button
                    className="btn btn-primary btn-block"
                    onClick={this.submitFormsecond.bind(this)}
                    style={{marginTop: '10px'}}
                  >
                    Next
                  </button>
                  
                    </div>
                    ) : (
                    <div>
                 
                    <button onClick={this.submitForm.bind(this)} disabled={this.state.disabled} type="submit" className="btn btn-primary  btn-block">
                    {this.state.create}
                    </button>
                    
                   

                    </div>
                    )}
                  </div>
                  )}

                </Form>
                </div>
                ) : (
                <p>Kunal</p>
                )
              }
              
              </Card>
      </div>
      );
  }
}

export default Create;
