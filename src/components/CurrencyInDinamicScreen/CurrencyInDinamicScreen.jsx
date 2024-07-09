import React, { useEffect, useState } from 'react';
import './CurrencyInDinamicScreen.css';

function CurrencyInDinamicScreen() {
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('default');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currencyData, setCurrencyData] = useState([]);

    useEffect(() => {
        fetch('https://api.nbrb.by/exrates/currencies')
            .then(response => response.json())
            .then(data => {
                setCurrencies(data);
            })
            .catch(error => {
                console.error('Ошибка при получении данных: ', error);
            });
    }, []);

    const enterCurrency = (event) => {
        setSelectedCurrency(event.target.value);
    };

    const enterStartDate = (event) => {
        setStartDate(event.target.value);
    };

    const enterEndDate = (event) => {
        setEndDate(event.target.value);
    };

    const clickSubmit = () => {
        if (selectedCurrency === 'default' || !startDate || !endDate) {
            alert("Выберите валюту и укажите даты.");
            return;
        }
        fetchCurrencyData(selectedCurrency, startDate, endDate);
    };

    const fetchCurrencyData = async (curId, start, end) => {
        try {
            const relatedCurrencies = currencies.filter(currency => 
                currency.Cur_ID === parseInt(curId) || currency.Cur_ParentID === parseInt(curId)
            );
            
            let allCurrencyData = [];
            for (const currency of relatedCurrencies) {
                const curId = currency.Cur_ID;
                const curDateStart = new Date(currency.Cur_DateStart);
                const curDateEnd = currency.Cur_DateEnd ? new Date(currency.Cur_DateEnd) : new Date();

                if ((curDateStart <= new Date(end)) && (curDateEnd >= new Date(start))) {
                    const queryStartDate = curDateStart > new Date(start) ? curDateStart.toISOString().split('T')[0] : start;
                    const queryEndDate = curDateEnd < new Date(end) ? curDateEnd.toISOString().split('T')[0] : end;

                    const response = await fetch(`https://api.nbrb.by/exrates/rates/dynamics/${curId}?startDate=${queryStartDate}&endDate=${queryEndDate}`);
                    const data = await response.json();
                    allCurrencyData = [...allCurrencyData, ...data];
                }
            }
            setCurrencyData(allCurrencyData);
        } catch (error) {
            console.error('Ошибка при получении данных о динамике валюты: ', error);
        }
    };

    return (
        <>
            <h1 className="page__title">Отображение курса валюты в динамике</h1>
            <div className="input-wrapper">
                <select className='drop-down-menu' onChange={enterCurrency} value={selectedCurrency}>
                    <option value="default" disabled>Выберите валюту</option>
                    {currencies.map(currency => (
                        <option key={currency.Cur_ID} value={currency.Cur_ID}>
                            {currency.Cur_Abbreviation}
                        </option>
                    ))}
                </select>
                <input className='input-date' type="date" onChange={enterStartDate} value={startDate} placeholder="Дата с"/>
                <input className='input-date' type="date" onChange={enterEndDate} value={endDate} placeholder="Дата по"
                />
                <button className='submit-btn' type='submit' onClick={clickSubmit}>Получить</button>    
            </div>
            {currencyData.length > 0 && (
                <table className='data-dinamic-table'>
                    <thead className='thead'>
                        <tr className='thead_line'>
                            <th className='thead__column'>Дата</th>
                            <th className='thead__column'>Курс</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currencyData.map((item, index) => (
                            <tr className='tbody_line' key={index}>
                                <td className='tbody__column'>{item.Date.substring(0, 10)}</td>
                                <td className='tbody__column'>{item.Cur_OfficialRate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default CurrencyInDinamicScreen;
