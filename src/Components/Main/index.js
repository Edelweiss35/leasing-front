import React, {Component} from "react";
import superagent from "superagent";
import {Redirect} from "react-router-dom";
import SecondForm from "../SecondForm";
import LegalTable from "../LegalTable"
import {Card, Form, H3, H4} from "../../Shared/styles";
import "../../App.css";
import APIPath from '../Api'

class App extends Component {
    constructor() {
        super();
        this.state = {
            countryJurisdiction: "",
            stateJurisdiction: "",
            representing: "",
            file: "",
            success: "",
            failed: "",
            selectedFile: null,
            logout: false,
            upload: "Save",
            disabled: false,
            expand: false,
            export: "Export",
            nextform: [],
            upform: [],
            legal: true,
            legalData: [],
            option: true,
            fileupload: "",
            export_result: [],
            clientSettingId: null,
            stateOptionArray: [],
            uploadedFile: null,
            LegalPositionData: [],
            cilentSettingCreated: false,
            progress: '',
            UploadBtnText: 'Upload Document',
            ShowProgressBar: 'none'
        };

        this.state.legal_clauses = [
            {
                id: 'decoy_legal_clause',
                text: [],
                reason: '',
                clause_name: [],
                dbtext: []
            }
        ];
    }

    componentDidMount() {
        /*
          calling API to get user settings and set them to the compoent's
          state
        */
        superagent.get(APIPath + "/api/v1/client-setting/").set("Accept", "application/json").set("Authorization", "Token " + localStorage.getItem("token")).then(res => {
            let clientSettingObject = res.body[0];
            this.setState({clientSettingId: clientSettingObject.id});
            this.setState({countryJurisdiction: clientSettingObject.country});
            this.setStateOption(clientSettingObject.country);
            this.setState({stateJurisdiction: clientSettingObject.state});
            this.setState({representing: clientSettingObject.representing});

        }).catch(err => {
            console.log("Error while calling API for ClientSettins", err)
        });

    }

    updateClientSetting(payload) {
        console.log("<<<<  Update client settings call begins >>>>>", payload)
        if(this.state.clientSettingCreated) {
            superagent.patch(APIPath + "/api/v1/client-setting/" + this.state.clientSettingId + '/').set("Accept", "application/json").set("Authorization", "Token " + localStorage.getItem("token")).send(payload).then(res => {
                let clientSettingObject = res.body;
                this.setState({clientSettingId: clientSettingObject.id});
                this.setState({countryJurisdiction: clientSettingObject.country});
                this.setStateOption(clientSettingObject.country);
                this.setState({stateJurisdiction: clientSettingObject.state});
            }).catch(err => {
                console.log("Error while calling API for ClientSettins", err)
            });
        }
        else{
            superagent.post(APIPath + "/api/v1/client-setting/").set("Accept", "application/json").set("Authorization", "Token " + localStorage.getItem("token")).send(payload).then(res => {
                let clientSettingObject = res.body;
                this.setState({clientSettingId: clientSettingObject.id});
                this.setState({countryJurisdiction: clientSettingObject.country});
                this.setStateOption(clientSettingObject.country);
                this.setState({stateJurisdiction: clientSettingObject.state});
                this.setState({clientSettingCreated: true})
            }).catch(err => {
                console.log("Error while calling API for ClientSettins", err)
            });
        }

    }

    handleCountryJurisdiction = event => {
        this.setState({countryJurisdiction: event.target.value});
        // logic to setup initial state when the
        // country changes
        if (event.target.value == 'AUS') {
            var state = 'NSW'
        } else if (event.target.value == 'US') {
            var state = 'AL'
        } else if (event.target.value == 'UK') {
            var state = 'WAL'
        } else if (event.target.value == 'NZ') {
            var state = 'NZ-AUK'
        } else if (event.target.value == "CAN") {
            var state = 'AB'
        }
        // update call to settings enpoint
        // to update the latest client settings

        this.updateClientSetting({country: event.target.value, state: state, representing: this.state.representing})
    };

    handleStateJurisdiction = event => {
        this.setState({stateJurisdiction: event.target.value});
        this.updateClientSetting({state: event.target.value, country: this.state.countryJurisdiction, representing: this.state.representing})
    };

    handleRepresenting = event => {
        this.setState({representing: event.target.value});
        this.updateClientSetting({state: this.state.stateJurisdiction, country: this.state.countryJurisdiction, representing: event.target.value})
    };

    fileChangedHandler = event => {
        this.setState({selectedFile: event.target.files[0]});
        this.setState({
            UploadBtnText: 'Uploading...',
            ShowProgressBar: 'block'
        });
        let form = new FormData();
        form.append("document", event.target.files[0]);
        
        superagent.post(APIPath + "/api/v1/document-upload/").set("Accept", "application/json").set("Authorization", "Token " + localStorage.getItem("token")).send(form).on('progress', function(e){
            console.log(e.direction,"is done",e.percent,"%");
            this.setState({
                progress: e.percent
            });
        }.bind(this)).then(res => {
            console.log("_____ response is____", res)
            const tempData = new Array()
            for(let data of new Array(...this.state.legal_clauses)){
                let tempObject = new Object();
                tempObject['clause_name'] = data['clause_name'].map(value => ({'text': value}))
                tempObject['text'] = data['text'].map(value => ({'content': value}))
                tempObject['document'] = res.body.id
                tempObject['setting'] = this.state.clientSettingId
                tempObject['reason'] = data['reason']
                tempData.push(tempObject);
            }
            console.log("Temp data is ", tempData)
            console.log("this.state.legal_clauses after document upload is", this.state.legal_clauses)

            this.setState({
                UploadBtnText: 'Processing...',
                progress: '0'
            });

            superagent.post(APIPath + "/api/v1/legal-positions/").set("Accept", "application/json").set("Authorization", "Token " + localStorage.getItem("token")).send(tempData).on('progress', function(e){
                console.log(e.direction,"is done",e.percent,"%");
                this.setState({
                    progress: e.percent
                });
            }.bind(this)).then( res => {
                this.setState({
                    uploadedFile: res.body,
                    expand: true,
                });
                this.setState({fileupload: "yes", file: this.state.uploadedFile.id});
                const export_result = JSON.parse(res.text);
                console.log("response data is ", export_result)
                this.setState({export_result: export_result});
            }).catch((error) => {
                this.setState({
                    UploadBtnText: 'Upload Document',
                    progress: '0',
                    ShowProgressBar: 'none'
                }); 
                console.log("error is", error)
                alert("Error in API call")
            })

                }).catch(err => {
                    console.log("err", err);
                    this.setState({fileupload: "no"});
                });
    };
    handleaction1 = event => {
        this.setState({action1: event.target.value});
    };
    handlekeep1 = event => {
        this.setState({keep1: event.target.value});
    };
    handleaction2 = event => {
        this.setState({action2: event.target.value});
    };
    handlekeep2 = event => {
        this.setState({keep2: event.target.value});
    };
    handlereason2 = event => {
        this.setState({reason2: event.target.value});
    };
    handlereason1 = event => {
        this.setState({reason1: event.target.value});
    };

    submitForm = event => {

        for(let data of new Array(...this.state.legal_clauses)){
            let tempObject = new Object();

            if(data['clause_name']==''){
                alert('Description fields is empty');
            }else if(data['text']==''){
                alert('Search text fields is empty');
            }else if(data['reason']==''){
                alert('Lease required amendment is empty');
            }else{
                this.setState({legal:false});
            }
            
        }
        
        console.log('file uploading state')
        console.log(this)
        event.preventDefault();
        this.setState({disabled: true, upload: "Saving"});
        let tempData = new Array()
        for(let legalPosition of this.state.legal_clauses){
            legalPosition['document'] = this.state.file ? this.state.uplodedFile.id : null
            tempData.push(legalPosition)
        }
        this.setState({expand: false, disabled: true, upload: "Save"});
        //this.setState({legalPositionData: tempData})
    }

    getAuthenticationToken() {
        return localStorage.getItem("token");
    }

    handleLogout() {
        localStorage.removeItem("token");
        this.setState({logout: true});
    }

    eventHandlercreate = () => {
        this.setState({option: false})
    }

    eventHandler = () => {
        const payload = {
            email: localStorage.getItem("email")
        }
        this.setState({legal: false})

    }
    eventHandler_tomain = () => {
        this.setState({
            legal: true,
            expand: false,
            option: true,
            UploadBtnText: 'Upload Document',
            progress: '0',
            ShowProgressBar: 'none'
        })
        
    }
    
    legalHandler = () => {
        this.setState({legal: true})
    }
    handleSuccess = () => {
        this.setState({legal: true})
    }

    isAuthenticated() {
        // method used to check is user
        // is authenticated .
        const token = localStorage.getItem("token");
        return token && token.length > 10
    }

    getTable(table) {
        this.setState({clauses: table})
    }

    getTable_legal(table) {
        console.log("this.getTable_legal is called with table", table)
        this.setState({legal_clauses: table})
        this.setState({check_legal: true})
    }

    getExportTable(table) {
    }

    optionParser(option, i) {
        return (<option key={i} value={option}>{option}</option>)

    }

    setStateOption(countryJurisdiction) {
        console.log("set state options begins")
        if (countryJurisdiction == 'AUS') {
            this.setState({
                stateOptionArray: [
                    "NSW",
                    "VIC",
                    "QLD",
                    "TAS",
                    "SA",
                    "WA",
                    "NT",
                    "ACT"
                ]
            })
        } else if (countryJurisdiction == 'US') {
            this.setState({
                stateOptionArray: [
                    "AL",
                    "AK",
                    "AZ",
                    "AR",
                    "CA",
                    "CO",
                    "CT",
                    "DC",
                    "DE",
                    "FL",
                    "GA",
                    "HI",
                    "ID",
                    "IL",
                    "IN",
                    "IA",
                    "KS",
                    "KY",
                    "LA",
                    "ME",
                    "MD",
                    "MA",
                    "MI",
                    "MN",
                    "MS",
                    "MO",
                    "MT",
                    "NE",
                    "NV",
                    "NH",
                    "NJ",
                    "NM",
                    "NY",
                    "NC",
                    "ND",
                    "OH",
                    "OK",
                    "OR",
                    "PA",
                    "RI",
                    "SC",
                    "SD",
                    "TN",
                    "TX",
                    "UT",
                    "VT",
                    "VA",
                    "WA",
                    "WV",
                    "WI",
                    "WY"
                ]
            })
        } else if (countryJurisdiction == 'UK') {
            this.setState({
                stateOptionArray: ["WAL", "ENG", "NIR", "SCO"]
            })
        } else if (countryJurisdiction == 'NZ') {
            this.setState({
                stateOptionArray: [
                    "NZ-AUK",
                    "NZ-BOP",
                    "NZ-CAN",
                    "NZ-GIS",
                    "NZ-HKB",
                    "NZ-MBH",
                    "NZ-MWT",
                    "NZ-NSN",
                    "NZ-NTL",
                    "NZ-OTA",
                    "NZ-STL",
                    "NZ-TAS",
                    "NZ-TKI",
                    "NZ-WKO",
                    "NZ-WGN",
                    "NZ-WTC",
                    "NZ-CIT"
                ]
            })
        } else if (countryJurisdiction == "CAN") {
            this.setState({
                stateOptionArray: [
                    'AB',
                    'BC',
                    'MB',
                    'NB',
                    'NL',
                    'NS',
                    'NT',
                    'NU',
                    'ON',
                    'PE',
                    'QC',
                    'SK',
                    'YT'
                ]
            })
        } else {
            this.setState({stateOptionArray: ['No Options']})
        }
    }

    render() {
        console.log("this.state.countryJurisdiction is", this.state.countryJurisdiction)
        const isAlreadyAuthenticated = this.isAuthenticated();
        const isExpand = this.state.expand;
        const isLegal = this.state.legal;
        //  const isOption = this.state.option;
        return (<div>
                {
                    !isAlreadyAuthenticated
                        ? (<Redirect to={{
                            pathname: "/"
                        }}/>)
                    : (<div className='row' style={{display:"flow-root"}}>
                       {/* MENUE BAR BUTTOMS BEGINS HERE */}
                       <button className="btn btn-danger logout" onClick={this.handleLogout.bind(this)} style={{
                           display: 'inline-block',
                           float: 'right'
                       }}>
                       Logout
                       </button>
                       <button className="btn btn-primary logout" onClick={this.eventHandler_tomain} style={{
                           display: 'inline-block',
                           float: 'right'
                       }}>
                       Legal Position
                       </button>
                       <button className="btn btn-primary logout" onClick={this.eventHandler} style={{
                           display: 'inline-block',
                           float: 'right'
                       }}>
                       Details Upload
                       </button>
                       </div>)}

                {
                    isLegal ?
                        (<Card className="my-4" style={{
                            maxWidth: "1200px"
                        }}>
                         <Form onSubmit={this.submitForm} className="pt-4" style={{
                             maxWidth: "1200px"
                         }}>
                         <p style={{
                             fontSize: "37px",
                             marginTop: "20px",
                             textAlign: "center"
                         }}>Legal Position</p>
                         <LegalTable formData={this.state.legal_clauses} onProduct={this.getTable_legal.bind(this)}/>
                         <button name="save button form main" className="btn btn-primary float-right" onClick={this.legalHandler}>Save</button>
                         </Form>
                         </Card>)

                    : (<div>
                       {
                           !isExpand
                               ? (<Card className="my-4" style={{
                                   maxWidth: "1200px"
                               }}>
                                  <Form onSubmit={this.submitForm} className="pt-4" style={{
                                      maxWidth: "1200px"
                                  }}>
                                  <p style={{
                                      fontSize: "37px",
                                      marginTop: "20px",
                                      textAlign: "center"
                                  }}>Details Upload</p>
                                  <label>Jurisdiction</label>

                                  {/* Country Begins */}
                                  <div>
                                  <select id="selectCountry" className="form-control" value={this.state.countryJurisdiction}
                                  onChange={this.handleCountryJurisdiction} placeholder="Country" style={{
                                      float: "left",
                                      width: "48%"
                                  }}>
                                  <option value="AUS">AUS</option>
                                  <option value="US">US</option>
                                  <option value="UK">UK</option>
                                  <option value="NZ">NZ</option>
                                  <option value="CAN">CAN</option>
                                  </select>
                                  {/* States Begins */}
                                  <select id="sel ectState" className="form-control" value={this.state.stateJurisdiction}
                                  onChange={this.handleStateJurisdiction} style={{
                                      float: "right",
                                      width: "48%"
                                  }}>
                                  {Array.apply(null, this.state.stateOptionArray).map((item, i) => this.optionParser(item, i))}
                                  </select>
                                  </div>
                                  {/* country ends */}

                                  <label>Representing</label>
                                  <select className="form-control" value={this.state.representing} onChange={this.handleRepresenting}>
                                  <option value="TNT">Tenant</option>
                                  <option value="LND">Landlord</option>
                                  </select>
                                  {/* earlier product table used to be here */}
                                  <div style={{
                                      display: 'block'
                                  }}>
                                  <span className="btn btn-success btn-file float-left" style={{
                                      marginTop: "10px"
                                  }}>
                                  {this.state.UploadBtnText}
                                  <input type="file" className="form-control-file border" onChange={this.fileChangedHandler}
                                  id="upload"/>
                                  </span>
                                  <button disabled={this.state.disabled} className="btn btn-primary float-right" type="submit"
                                  style={{
                                      marginTop: "10px"
                                  }}>
                                  {this.state.upload}
                                  </button>
                                  </div>
                                  <div className="progressdiv">
                                  <progress style={{display: this.state.ShowProgressBar }} value={this.state.progress} max="100" label={this.state.progress}></progress>
                                  </div>
                                  </Form>
                                  
                                  
                                  <p className="text-center" style={{
                                      color: "green"
                                  }}>
                                  {this.state.success}
                                  </p>
                                  <p className="text-center" style={{
                                      color: "red"
                                  }}>
                                  {this.state.failed}
                                  </p>
                                  
                                  </Card>)
                           : (<SecondForm formData={this.state.export_result} filename={this.state.selectedFile !== null
                                                                                        ? this.state.selectedFile['name']
                                                                                        : ''} onProduct={this.getExportTable.bind(this)}/>)
                       }
                       </div>)
                }
                </div>
               )
    }
}
export default App
