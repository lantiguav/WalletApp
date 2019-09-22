import React from 'react'

const TransferList = ({transfers, onDeleteClick}) => (
    <table className="table">
        <tbody>
            {transfers.map(transfer => (
                <tr key={transfer.id}>
                    <td>{transfer.description}</td>
                    <td className={transfer.amount >= 0 ? 'text-success' : 'text-danger'}>{transfer.amount}</td>
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