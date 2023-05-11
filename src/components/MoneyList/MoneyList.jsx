import React from 'react';
import moneyData from '../data/moneyData';

const MoneyList = props => {
    return (
        <>
            <div className="money-container">
                <ul className="money-list">
                    {moneyData.map(money => (
                    <li className={`money-list-item ${props.currentQuestionNum === money.id ? "active" : ""}`} key={money.id}>
                        <span className="money-list-item_number">{money.id}</span>
                        <span className="money-list-item_amount">{money.amount}</span>
                    </li>
                    ))}
                </ul>
            </div>
        </>
    )
};

export default MoneyList;