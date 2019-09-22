import React from 'react'
import CurrencyFormat from 'react-currency-format';

const TransferList = ({transfers, onDeleteClick}) => (
    <table className="table">
        <tbody>
            {transfers.map(transfer => (
                <tr key={transfer.id}>
                    <td>{transfer.description}</td>
                    <td className={transfer.amount >= 0 ? 'text-success' : 'text-danger'}>
                        <CurrencyFormat value={transfer.amount} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <div>{value}</div>} />
                    </td>
                    <td>
                        <button 
                            className="btn btn-danger" 
                            onClick={e => onDeleteClick(transfer.id, transfer.amount)}
                            key={'delete'+transfer.id} >Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)

export default TransferList