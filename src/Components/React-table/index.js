import React, { Component } from "react";
import axios from 'axios';
import APIPath from '../Api'


class Products extends Component {  
    constructor(props) {
      super(props);
      this.state = {};
      this.state.filterText = "";
      this.state.onProduct = this.props.onProduct;
      this.state.products = this.props.formData;
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
        clausename: "",
        text: "",
        action: "",
        reason: ""
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
    render() {
      return (
        <div>
          {/* <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)}/> */}
          <ProductTable onProductTableUpdate={this.handleProductTable.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} products={this.state.products} filterText={this.state.filterText}/>
        </div>
      );
  
    }
  
  }
  class SearchBar extends Component {
    handleChange() {
      this.props.onUserInput(this.refs.filterTextInput.value);
    }
    render() {
      return (
        <div>
  
          <input type="text" placeholder="Search..." value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange.bind(this)}/>
  
        </div>
  
      );
    }
  
  }
  
  class ProductTable extends Component {
  
    render() {
      var onProductTableUpdate = this.props.onProductTableUpdate;
      var rowDel = this.props.onRowDel;
      var filterText = this.props.filterText;
      var product = this.props.products.map(function(product) {
        if (product.clausename.indexOf(filterText) === -1) {
          return;
        }
        return (<ProductRow onProductTableUpdate={onProductTableUpdate} product={product} onDelEvent={rowDel.bind(this)} key={product.id}/>)
      });
      return (
        <div className="clauseTable">
          <div>
          <table className="table table-bordered" style={{marginTop:"50px"}}>
            <thead>
              <tr>
                <th style={{width:'12%',padding:"0px"}}>Clause Names</th>
                <th style={{width:'30%',padding:"0px"}}>Key Text</th>
                <th style={{width:'46%',padding:"0px"}}>Lease required amendment</th>
                <th style={{width:'12%',padding:"0px"}}>Show lease required amendment when key text is</th>
              </tr>
            </thead>
  
            <tbody>
              {product}
  
            </tbody>
  
          </table>
          </div>
          <div>
            <button type="button" onClick={this.props.onRowAdd} className="btn btn-success pull-right" style={{float:"right",marginLeft:"7px"}}>Add</button>
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
  
      return (
        <tr className="eachRow"
          style={{padding:"0px"}}>
          <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            "type": "clausename",
            value: this.props.product.clausename,
            id: this.props.product.id
          }}/>
          <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: "text",
            value: this.props.product.text,
            id: this.props.product.id
          }}/>
          <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: "reason",
            value: this.props.product.reason,
            id: this.props.product.id
          }}/>
          <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
            type: "action",
            value: this.props.product.action,
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
    constructor(props){
      super(props);
      this.state = {items: [
        
      ]}
    }
    componentWillMount(){
      const tempdata = {
        clauses: "hello",
        filename:"hello"
      }
      axios(APIPath + "/reason",{
        method: 'POST',
        data: tempdata,
        headers:{
          'Content-Type': 'application/json'
        },
        json:true
        
      })
      .then((response) => {
        
        const export_result = response.data;
        
        this.setState({
          items: export_result
    
        });
      })
      .catch((error) => {
        console.log(error)
      })
    }
    filter(e){
      this.setState({filter: e.target.value})
    
    }
    condition = this.props.cellData.type;
    render() {
      let items = this.state.items;
      let tempDatalist;
      if (this.state.filter){
        items = items.filter( item =>
          item.reason.toLowerCase()
          .includes(this.state.filter.toLowerCase()))
        items = items.filter( item =>
          item.action.toLowerCase()
          .includes(this.state.filter.toLowerCase()))
        items = items.filter( item =>
          item.clausename.toLowerCase()
          .includes(this.state.filter.toLowerCase()))  
      }
      if(this.condition == "reason"){
        tempDatalist = <div><input type='text' list="json-datalist1" name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onProductTableUpdate} style={{height:"100%",border:'none',marginTop:"15px"}}/>
        <datalist id="json-datalist1">
        {this.state.items.map((item) =>
          <option value={item.reason} />
            
        )}
        </datalist></div>
      }
      
      if(this.condition == "clausename"){
        tempDatalist = <div><input type='text' list="json-datalist2" name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onProductTableUpdate} style={{height:"100%",border:'none',marginTop:"15px"}}/>
        <datalist id="json-datalist2">
        {this.state.items.map((item) =>
          <option value={item.clausename} />
            
        )}
        </datalist></div>
      }
      if(this.condition == "action"){
        tempDatalist =<select
                    className="form-control"
                    name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onProductTableUpdate} style={{height:"100%",border:'none',marginTop:"15px"}}
                    >
                    <option>Found</option>
                    <option>Not Found</option>
                  </select>
      }
      return (
        <td style={{padding:"0px"}}>
          {/*  */}
          {(this.condition == "text")? (
            
            <textarea name={this.props.cellData.type} list="json-datalist" id={this.props.cellData.id}  onChange={this.props.onProductTableUpdate}style={{width:"100%",paddingTop:"15px"}}>{this.props.cellData.value}</textarea>
          ):(
            <div>
            {tempDatalist}
            </div>
          )}
          
        </td>
      );
  
    }
  
  }
  export default Products;
