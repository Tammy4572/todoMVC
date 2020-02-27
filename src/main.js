import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function getTodos(){

}

class App extends React.Component {

    constructor(props){
        super(props);
        this.getAllItems = () => {
            axios.get('/api/todos').then(serverResponse =>  {
            this.setState({todoItems: serverResponse.data});
            })
        }
        this.state = {
            todoItems: [],
            title: ""
        }
    }

    componentWillMount(){
        this.getAllItems();
    }
    _handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/todos', {
        title: this.state.title,
        order: 0
        })
        .then( (response) => {
            this.getAllItems();
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    _handleChange = (e) => {
        e.preventDefault();
        let newInputState = {
            [event.target.name]: event.target.value
        }
        this.setState(newInputState);
    }
    render(){
        console.log(this.state.todoItems);
        let renderTodos = this.state.todoItems.map((todo) => {
            console.log(todo);
            return <TodoItem key={todo._id} tod={todo} getAllItems={this.getAllItems}/>
        })
        return (
            <div>
                <form method="post" onSubmit={this._handleSubmit}>
                    <input onChange={this._handleChange} value={this.state.title} type="text" name="title"/>
                    <button className="btn btn-primary"> Add todo </button>
                </form>
               <div className="row">
                    {renderTodos}
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.querySelector("#root"));