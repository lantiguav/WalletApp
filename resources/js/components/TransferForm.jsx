import React from 'react'
import CurrencyFormat from 'react-currency-format';

const TransferForm = ({form, onChange, onSubmit}) => (
    <form className="form-inline justify-content-center" onSubmit={onSubmit}>
        <div className="input-group mx-sm-2 mb-2">
            <input
                type="text"
                className="form-control"
                placeholder="Description"
                name="description"
                maxLength="40"
                required
                value={form.description}
                onChange={onChange}/>
        </div>
        <div className="input-group mx-sm-2 mb-2">
            <div className="input-group-prepend">
                <div className="input-group-text">$</div>
            </div>
            <CurrencyFormat 
                max="999999"
                min="-999999"
                name="amount"
                placeholder="Amount"
                value={form.amount}
                className="form-control"
                required
                onChange={onChange}
                thousandSeparator={true} 
                prefix={''} />
                
            {/* <input 
                type="number" 
                max="999999"
                min="-999999"
                className="form-control" 
                name="amount"
                required
                placeholder="Amount"
                value={form.amount}
                onChange={onChange}/> */}
        </div>
        <div className="input-group mb-2">
            <button type="submit" className="btn btn-primary col-12">Add</button>
        </div>
    </form>
)

export default TransferForm