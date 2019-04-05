import React, {Component} from "react";
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

class Row extends Component {
    /* 
        Row component is used to render row in LegalPosition table
        you can take it as each row in the legal postion table 
    */

    constructor(props){
       super(props);
       console.log("props in Row component constructor is ", props);
    }

    onDelEvent(){
        console.log("onDelEvent is called for row", this.props.row);
        this.props.onDelEvent(this.props.row);
    }

    handleClauseNameUpdate(tags){
        /* 
            this methos is fired on description field update 
            when descript field A.K.A clause_name is updated this method is called with all 
            related tags of that field
        */

        console.log("handleClauseNameUpdate is called with following tags", tags);
        this.props.row.clause_name = tags;
        this.props.onTableUpdate(this.props.row);
    }

    handleReasonUpdate(event){
        console.log("handleReasonUpdate is called with event ", event)
        this.props.row.reason = event.target.value;
        this.props.onTableUpdate(this.props.row);
    }

    handleTextUpdate(tags){
        /* 
            event handler used to update the text A.K.A key_text
        */
        console.log("handleTextUpdate is called with following tags", tags)
        this.props.row.text = tags;
        this.props.onTableUpdate(this.props.row);
    }

    render() {
        console.log("this.props in Row component render is", this.props)
        return (
            <tr className="eachRow" style={{padding: "0px"}} id={this.props.row.id} key={this.props.row.id}>
                <td>
                    <TagsInput name="clause_name" value={this.props.row.clause_name} onChange={this.handleClauseNameUpdate.bind(this)} onlyUnique={true} inputProps={{ className: 'react-tagsinput-input',
                    placeholder: 'Description'}} />
                </td>
                <td>
                    <input type="text" name="reason" onChange={this.handleReasonUpdate.bind(this)} value={this.props.row.reason}/>
                </td>
                <td>
                    <TagsInput value={this.props.row.text} onChange={this.handleTextUpdate.bind(this)} onlyUnique={true} inputProps={{ className: 'react-tagsinput-input',
                    placeholder:'Search Text'}} />
                </td>
                <td>
                    <TagsInput name="dbText" value={this.props.foundKeyText} disabled/>
                </td>
                <td className="del-cell" style={{padding: "0px"}}>
                    <input type="button" onClick={this.onDelEvent.bind(this)} value="X" className="del-btn" style={{height: "100%", border: 'none', marginTop: "15px"}}/>
                </td>
            </tr>
        );

    }

}

export default Row;