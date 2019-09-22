import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TransferForm from './TransferForm';
import TransferList from './TransferList';

export default class Example extends Component {

    constructor(props){
        super(props)

        this.state = {
            money : 0.0,
            transfers : [],
            error : null,
            form: {
                description : '',
                amount : '',
                wallet_id : 3
            }
        }

        this.handleChange =  this.handleChange.bind(this);
        this.handleSubmit =  this.handleSubmit.bind(this);
    }

    async componentDidMount(){
        try {
            let res = await fetch('/api/wallet');
            let data = await res.json();

            this.setState({
                money : data.money,
                transfers : data.transfers
            })
        } catch (error) {
            this.setState({
                error
            })
        }
    }

    handleChange(e){
        this.setState({
            form :{
                ...this.state.form,
                [e.target.name] : e.target.value
            }
        })
        console.log(e.target.value);
    }

    async handleSubmit(e){
        e.preventDefault();

        try {
            let config = {
                method : 'POST',
                headers : {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(this.state.form)
            }

            let res = await fetch('/api/transfer/create', config)
                            .then(res => res.ok ? res.json() : false)
                            .catch(error => error);
            let data = await res;
            console.log('data', data);

            if(data){
                this.setState({
                    transfers : this.state.transfers.concat(data),
                    money : this.state.money + (parseInt(data.amount))
                });
            } else {
                alert('Se ha producido un error');
            }
        } catch (error) {
            this.setState({error})
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12 m-t-md">
                        <p className="title">$ {this.state.money}</p>
                    </div>
                    <div className="col-md-12">
                        <TransferForm form={this.state.form} onChange={this.handleChange} onSubmit={this.handleSubmit}/>
                    </div>
                </div>
                <div className="m-t-md">
                    <TransferList transfers={this.state.transfers} onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
