import React, { Component } from 'react';
import axios from 'axios';

export default class TodoItem extends Component {
    constructor(props){
        super(props);
    }

    _handleDelete = (e) => {
        e.preventDefault();
        let deleteRoute = `/api/todos/${this.props.todo._id}`
        axios.delete(deleteRoute).then(response => {
            console.log(response);
            this.props.getAllItems();
        })
    }
    rener(){
        const { title } = this.props.todo
        return(
            
            <div className="col-m-12 text-center">
                <h3>{title}</h3>
                <button type="button" className="btn btn-danger" onClick={this._handleDelete}>Delete Todo</button>
            </div>
        )

    }
}