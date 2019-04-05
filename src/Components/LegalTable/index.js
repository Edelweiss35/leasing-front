import React, {Component} from "react";
import LegalPositionTable from "./Table"


class Products extends Component {
    /*
    wrapper class for Table
    */

    constructor(props) {
        super(props);
        this.state = {};
        this.state.onProduct = this.props.onProduct;
        this.state.products = this.props.formData;
        this.state.foundKeyText = [];
        console.log("props in the container of products components are ", props)
    }

    handleRowDel(product) {
        // method used to delete the row of table
        // in legal position table . it use the product instance
        // and find its index in the state.products
        // then delete element at that particular index and
        // finally reset the state


        let index = this.state.products.indexOf(product);
        this.state.products.splice(index, 1);
        this.setState(this.state.products);
    };

    handleAddEvent(evt) {
        // class method used to  create an object
        // with only a id as key and a randomly generated
        // string as it value
        // it push the newly created object to
        // state and set the state again

        let id = Math.random().toString(36).substring(7);
        let product = {id: id, clause_name: [], reason: '', text: [], dbtext: []};
        this.state.products.push(product);
        this.setState(this.state.products);

    }

    handleProductTable(row){
        for(let record of this.state.products){
            if(record.id == row.id){
                record.id = row.id;
                record.reason = row.reason
                record.text = row.text;
                record.clause_name = row.clause_name;
            }   
            else{
                // actually we are fetching only that record
                // which is having same #id as updaed row
                continue;
            }
        }
        console.log("this.state.products are", this.state.products)
        this.setState(this.state.products)
    }

    render() {
        return (
            <div>
                <LegalPositionTable onTableUpdate={this.handleProductTable.bind(this)}
                              onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)}
                              products={this.state.products} filterText={this.state.filterText}
                              foundKeyText={this.state.foundKeyText}/>
            </div>
        );

    }

}

export default Products;