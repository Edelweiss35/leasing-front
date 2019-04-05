import React, {Component} from "react";
import Row from "./Row";

class LegalPositionTable extends Component {
    /* 
        class used to  render the legal position view table 
        this table has ability to store tags input in a single field
    */
    constructor(props){
        super(props);
        console.log("props in consturctor of LeasingTable Component is ", props);
    }

    getRows(){
        console.log("get row has been called")
        let rows = this.props.products.map(function (row) {
            return (<Row onTableUpdate={this.props.onTableUpdate}
                        row={row}
                        onDelEvent={this.props.onRowDel}
                        key={row.id}
                        foundKeyText={this.props.foundKeyText}/>
                        )});
        console.log("rows before return in getRows are", rows);
        return rows;
    }
    render() {
        /*
            this will return an array of Row components
            this array will be then rendert into this conponent using return 
            method of this LeasingTable Component 
        */

       let onRowDel = this.props.onRowDel;
       let foundKeyText = this.props.foundKeyText;
       let onTableUpdate = this.props.onTableUpdate;

       let rows = this.props.products.map(function (row) {
        return (<Row onTableUpdate={onTableUpdate}
                    row={row}
                    onDelEvent={onRowDel}
                    key={row.id}
                    foundKeyText={foundKeyText}/>
                    )});
        console.log("rows before render is", rows)
        return (
            <div className="clauseTable">
                <div>
                    <table className="table table-bordered" style={{marginTop: "50px"}}>
                        <thead>
                        <tr>
                            <th style={{width: '15%', padding: "0px"}}>Description</th>
                            <th style={{width: '25%', padding: "0px"}}>Lease required amendment</th>
                            <th style={{width: '25%', padding: "0px"}}>What you are looking for</th>
                            <th style={{width: '25%', padding: "0px"}}>key text in database</th>
                            <th style={{width: '5%'}}>Del</th>
                        </tr>
                        </thead>

                        <tbody>
                        {rows}

                        </tbody>

                    </table>
                </div>
                <div>
                    <button type="button" onClick={this.props.onRowAdd} className="btn btn-success pull-right"
                            style={{float: "right", marginLeft: "7px"}}>Add
                    </button>
                </div>
            </div>
        );

    }

}

export default LegalPositionTable;