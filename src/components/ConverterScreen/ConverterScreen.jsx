import React, { useState, useEffect } from 'react';
import './ConverterScreen.css';

function ConverterScreen() {
    const [amountA, setAmountA] = useState('');
    const [amountB, setAmountB] = useState('');
    const [currencyA, setCurrencyA] = useState('USD');
    const [currencyB, setCurrencyB] = useState('EUR');
    const [currencies, setCurrencies] = useState([]);
    const [rates, setRates] = useState({});

    useEffect(() => {
        fetch('https://api.nbrb.by/exrates/currencies')
            .then(response => response.json())
            .then(data => {
                const currencyMap = data.reduce((acc, currency) => {
                    acc[currency.Cur_Abbreviation] = currency.Cur_ID;
                    return acc;
                }, {});
                setCurrencies(data);

                const fetchRates = async () => {
                    const currencyAId = currencyMap[currencyA];
                    const currencyBId = currencyMap[currencyB];

                    const [rateAResponse, rateBResponse] = await Promise.all([
                        fetch(`https://api.nbrb.by/exrates/rates/${currencyAId}`),
                        fetch(`https://api.nbrb.by/exrates/rates/${currencyBId}`)
                    ]);

                    const rateAData = await rateAResponse.json();
                    const rateBData = await rateBResponse.json();

                    setRates({
                        [currencyA]: rateAData.Cur_OfficialRate,
                        [currencyB]: rateBData.Cur_OfficialRate
                    });
                };

                fetchRates();
            });
    }, [currencyA, currencyB]);

    const convert = (amount, fromCurrency, toCurrency) => {
        if (!rates[fromCurrency] || !rates[toCurrency]) return '';
        const convertedAmount = (amount * rates[fromCurrency]) / rates[toCurrency];
        return convertedAmount.toFixed(4);
    };

    const enterAmountA = (e) => {
        const value = e.target.value;
        setAmountA(value);
        setAmountB(convert(value, currencyA, currencyB));
    };

    const enterAmountB = (e) => {
        const value = e.target.value;
        setAmountB(value);
        setAmountA(convert(value, currencyB, currencyA));
    };

    return (
        <>
            <div className='converter-wrapper'>
                <div className="currency-wrapper">
                    <input className='currency-input' type="number" value={amountA} onChange={enterAmountA} />
                    <select className='drop-down-menu' value={currencyA} onChange={(e) => setCurrencyA(e.target.value)} >
                        {currencies.map(currency => (
                            <option key={currency.Cur_Abbreviation} value={currency.Cur_Abbreviation}>
                                {currency.Cur_Abbreviation}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="currency-wrapper">
                    <input className='currency-input' type="number" value={amountB} onChange={enterAmountB} />
                    <select className='drop-down-menu' value={currencyB} onChange={(e) => setCurrencyB(e.target.value)} >
                        {currencies.map(currency => (
                            <option key={currency.Cur_Abbreviation} value={currency.Cur_Abbreviation}>
                                {currency.Cur_Abbreviation}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    );
}

export default ConverterScreen;
