import superagent from "superagent";
// import { Redirect } from "react-router-dom";
import "../../App.css";
import {Card, Form, H3, H4} from "../../Shared/styles"
import React, { Component } from "react";
import APIPath from '../Api'


class Products extends Component {
  
    constructor(props) {
      super(props);
      //  this.state.products = [];
      const state = {
        email: localStorage.getItem("email"),
      };
      this.state = {};
      this.state.filterText = "";
      this.state.onProduct = this.props.onProduct;
      this.state.products = props.formData;
      this.state.filename = props.filename;

    }
    handleUserInput(filterText) {
      this.setState({filterText: filterText});
    };
    handleRowDel(product) {
      var index = this.state.products.indexOf(product);
      this.state.products.splice(index, 1);
      this.setState(this.state.products);
    };
  
    handleAddEvent(evt) {
      var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
      var product = {
        id: id,
        index:"",
        clause_no: "",
        clause_name: "",
        reason: 0,
        action: "",
        agree:""
        

      }
      this.state.products.push(product);
      this.setState(this.state.products);
  
    }
  
    handleProductTable(evt) {
      var item = {
        id: evt.target.id,
        name: evt.target.name,
        value: evt.target.value
      };
      var products = this.state.products.slice();
      var newProducts = products.map(function(product) {
  
        for (var key in product) {
          if (key == item.name && product.id == item.id) {
            product[key] = item.value;
 
          }
        }
        return product;
      });
      this.setState({products:newProducts});
      
      
      this.state.onProduct(newProducts);
    //  console.log(this.state.products);
    };
    handleExport(evt){
        var element = "export_div"
        var filename = ""
        var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        var postHtml = "</body></html>";
        var html = preHtml+document.getElementById(element).innerHTML+postHtml;
        
        var blob = new Blob(['\ufeff', html], {
            type: 'application/msword'
        });

        // Specify link url
        var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

        // Specify file name
        filename = filename?filename+'.doc':'leasing_document.doc';

        // Create download link element
        var downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if(navigator.msSaveOrOpenBlob ){
            navigator.msSaveOrOpenBlob(blob, filename);
        }else{
            // Create a link to the file
            downloadLink.href = url;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }

        document.body.removeChild(downloadLink);

      // let form = new FormData();
      // form.append("filename", this.state.filename)
      // superagent
      //   .post(APIPath + "/api/vi/export/")
      //   .send(form)
      //   .then(res => {
          
      //     window.open(res.text);
      //   })
      //   .catch(err => {
      //     console.log("err", err);

      //   });
    };
    render() {
        console.log("____ this.state.products are___", this.state.products)
      return (
        <Card className="my-4" style={{maxWidth:"1200px"}}>
          <Form onSubmit={this.submitForm} className="pt-4"style={{maxWidth:"1200px"}}>
        <div id="export_div" style={{'width':'93%','margin':'auto','textAlign':'center','marginTop':'30px'}}>
          <br></br>
          <br></br>
          <br></br>
          <center><p style={{color:'black',fontSize:'37px'}}>Export Result</p></center>
          {/* <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)}/> */}
          <ProductTable onProductTableUpdate={this.handleProductTable.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} products={this.props.formData} filterText={this.state.filterText}/>
        </div>
        <div>
            <button type="button" onClick={this.handleExport.bind(this)} className="btn btn-success pull-right" style={{float:"right"}}>Export</button>
        </div>
        </Form>
        
        </Card>
        
      );
  
    }
  
  }
  // class SearchBar extends Component {
  //   handleChange() {
  //     this.props.onUserInput(this.refs.filterTextInput.value);
  //   }
  //   render() {
  //     return (
  //       <div>
  //
  //         <input type="text" placeholder="Search..." value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange.bind(this)}/>
  //
  //       </div>
  //
  //     );
  //   }
  //
  // }
  
  class ProductTable extends Component {
  
    render() {
        console.log("this.props.products are", this.props.products)
      var onProductTableUpdate = this.props.onProductTableUpdate;
      var rowDel = this.props.onRowDel;
      var filterText = this.props.filterText;
      var product = this.props.products.map(function(product, i) {
        // if (product.clause_name.indexOf(filterText) === -1) {
        //   return;
        // }
        return (<ProductRow onProductTableUpdate={onProductTableUpdate} product={product} onDelEvent={rowDel.bind(this)} key={i}/>)
      });
      return (
        <div className="clauseTable">
          <div>
          <table className="table table-bordered" style={{marginTop:"80px",'backgroundColor':'white'}}>
            <thead style={{fontSize:"21px"}}>
              <tr>
                <th style={{width:'7%'}}>Amended no.</th>
                <th style={{width:'7%'}}>Clause no.</th>
                <th style={{width:'16%'}}>Clause Name</th>
                <th style={{width:'40%'}}>Lease required amendment</th>
                {/* <th style={{width:'10%'}}>Show lease required amendment when key text is</th> */}
                <th style={{width:'20%'}}>Lessor response to amendment Agreed/Not agreed</th>
              </tr>
            </thead>
  
            <tbody>
              {product}
  
            </tbody>
  
          </table>
          </div>
          
        </div>
      );
  
    }
  
  }
  
  class ProductRow extends Component {
    onDelEvent() {
      this.props.onDelEvent(this.props.product);
  
    }
    render() {
        console.log("__________________ this.props.product is _______", this.props.product)
  
      return (
        <tr className="eachRow"
          style={{padding:"0px"}}>
          <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            "type": "index",
            value: this.props.product.index,
            id: this.props.product.id
          }}/>
          <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: "clause_no",
            value: this.props.product.clause_no,
            id: this.props.product.id
          }}/>
          <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: "clause_name",
            value: this.props.product.clausename,
            id: this.props.product.id
          }}/>
          <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: "reason",
            value: this.props.product.reason,
            id: this.props.product.id
          }}/>
          {/* <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: "action",
            value: this.props.product.action,
            id: this.props.product.id
          }}/> */}
          <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: "agree",
            value: this.props.product.agree,
            id: this.props.product.id
          }}/>
          {/* <td className="del-cell"
          style={{padding:"0px"}}>
            <input type="button" onClick={this.onDelEvent.bind(this)} value="X" className="del-btn"/>
          </td> */}
        </tr>
      );
  
    }
  
  }
  class EditableCell extends Component {
  
    render() {
      return (
        <td
        style={{padding:"0px"}}>
          {/* <input type='text' name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onProductTableUpdate}/> */}
          <textarea name={this.props.cellData.type} id={this.props.cellData.id}  onChange={this.props.onProductTableUpdate}style={{width:"100%",'textAlign':'center'}}>{this.props.cellData.value}</textarea>
        </td>
      );
  
    }
  
  }
  export default Products;
  
  /*
  (The MIT License)
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */
  
