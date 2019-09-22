import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TransferForm from './TransferForm';
import TransferList from './TransferList';
import CurrencyFormat from 'react-currency-format';

export default class Example extends Component {

    constructor(props){
        super(props)

        this.state = {
            money : 0.0,
            transfers : [],
            error : '',
            form: {
                description : '',
                amount : '',
                wallet_id : 1
            }
        }

        this.handleChange =  this.handleChange.bind(this);
        this.handleSubmit =  this.handleSubmit.bind(this);
        this.handleDeleteClick =  this.handleDeleteClick.bind(this);
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
    }

    async handleDeleteClick(transferId, transferAmount){
        let config = {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({'id' : transferId})
        }

        let res = fetch('api/transfer/delete', config)
                    .then(res => res.ok ? res.json() : false)
                    .catch(error => error);
        
        let data = await res;

        if(data.success){
            this.setState({
                transfers : this.state.transfers.filter(x => x.id != transferId),
                money : this.state.money - transferAmount
            });
        } else {
            this.showError('Se ha producido un error');
        }
    }

    validate(){
        let amount = this.state.form.amount;
        amount = Number(amount.replace(/[^0-9.-]+/g,""));
        console.log(amount);
        console.log(this.state.form.amount);

        if(amount > 999999){
            console.log(amount)
            this.showError('El monto no puede ser mayor a $999,999')
        } 
        else if(amount < -99999){
            this.showError('El monto no puede ser menor a -$999,999')
        } else if(this.state.form.description.length > 40){
            this.showError('La descripción no puede contener más de 40 caracteres')
        } else if(this.state.form.description.length === 0){
            this.showError('La descripción es requerida')
        } else if(this.state.form.amount.length === 0){
            this.showError('El monto es requerido')
        } else {
            this.setState({
                form :{
                    ...this.state.form,
                    amount
                },
            },
                () => console.log(this.state.form)
            
            )

            this.showError('')
            return true;
        }

        return false;

    }

    async handleSubmit(e){
        e.preventDefault();

        try {
            if(this.validate()){
                console.log(this.state.form);
                let body = {
                    description: this.state.form.description, 
                    amount: Number(this.state.form.amount.replace(/[^0-9.-]+/g,"")),
                    wallet_id : 1         
                };
                let config = {
                    method : 'POST',
                    headers : {
                        'Accept' : 'application/json',
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify(body)
                }
    
                let res = await fetch('/api/transfer/create', config)
                                .then(res => res.ok ? res.json() : false)
                                .catch(error => error);
                let data = await res;
                console.log('data', data);

                this.setState({
                    transfers : this.state.transfers.concat(data),
                    money : parseFloat(this.state.money) + (parseFloat(data.amount)),
                    form : {
                        description : '',
                        amount : '',
                        wallet_id : 1
                    }
                });

            }
        } catch (error) {
            console.log('error', error)
            this.showError('No se ha podido registrar la transferencia.')
        }
    }

    showError(error){
        this.setState({error})
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12 mt-5">
                        <div className="title">
                            <CurrencyFormat value={this.state.money} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <div>{value}</div>} />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <em className="m-b-md">Nota: cualquier persona puede introducir o eliminar información</em>
                        <TransferForm form={this.state.form} onChange={this.handleChange} onSubmit={this.handleSubmit}/>

                        {
                            this.state.error && 
                            <div className="mx-4">
                                <h5 className="text-danger">{this.state.error}</h5>
                            </div>
                        }
                    </div>
                </div>
                <div className="mt-5">
                    <TransferList transfers={this.state.transfers} onDeleteClick={this.handleDeleteClick}/>
                </div>
            </div>
        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
