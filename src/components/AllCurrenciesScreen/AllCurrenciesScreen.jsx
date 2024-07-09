import { useEffect, useState } from 'react';
import './AllCurrenciesScreen.css';

function AllCurrenciesScreen() {
    const [data, setData] = useState([]);
    const [inputDate, setInputDate] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    const getData = async (date) => {
        const response = await fetch(`https://api.nbrb.by/exrates/rates?ondate=${date}&periodicity=0`);
        const result = await response.json();
        setData(result);
    }

    const enterDate = (event) => {
        setInputDate(event.target.value);
    }

    const clickSubmit = () => {
        setCurrentDate(inputDate);
    }

    useEffect(() => {
        if (currentDate) {
            getData(currentDate);
        }
    }, [currentDate]);

    return (
        <>
            <h1 className="page__title">Данные по валютам за {currentDate ? currentDate:"определенный день"}</h1>
            <div className="currencies-content">
                <div className="input-wrapper">
                    <input className='input-date' type="date" onChange={enterDate} value={inputDate} />
                    <button className='submit-btn' type='submit' onClick={clickSubmit}>Получить</button>    
                </div>                
                <ul className="currencies">
                    {data.map((item) => (
                        <li className='currencies__item' key={item.Cur_ID}>
                            <div className="first__currency">{item.Cur_Scale} {item.Cur_Abbreviation}</div>
                            <div className="second__currency">{item.Cur_OfficialRate} BYN</div> 
                        </li>
                    ))}
                </ul>
            </div>            
        </>
    );
}

export default AllCurrenciesScreen;
