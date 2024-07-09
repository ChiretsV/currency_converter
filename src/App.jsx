import React, { useState } from 'react';
import './App.css';
import AllCurrenciesScreen from './components/AllCurrenciesScreen/AllCurrenciesScreen';
import CurrencyInDinamicScreen from './components/CurrencyInDinamicScreen/CurrencyInDinamicScreen';
import ConverterScreen from './components/ConverterScreen/ConverterScreen';

function App() {
  const [activeScreens, setActiveScreens] = useState([]);

  const clickCheckbox = (screen) => {
    if (activeScreens.includes(screen)) {
      setActiveScreens(prevActiveScreens =>
        prevActiveScreens.filter(activeScreen => activeScreen !== screen)
      );
    } else {
      setActiveScreens(prevActiveScreens =>
        [...prevActiveScreens, screen]
      );
    }
  };

  return (
    <div className="App">
      <div className='switchers-wrapper'>
        <div className="switcher">
          <label className='switcher__title'>
            <input
              type="checkbox"
              checked={activeScreens.includes('allCurrencies')}
              onChange={() => clickCheckbox('allCurrencies')}
            />
            Курсы валют на выбранную дату
          </label>
        </div>
        <div className="switcher">
          <label className='switcher__title'>
            <input
              type="checkbox"
              checked={activeScreens.includes('currencyInDinamic')}
              onChange={() => clickCheckbox('currencyInDinamic')}
            />
            Курс валюты в динамике
          </label>
        </div>
        <div className="switcher">
          <label className='switcher__title'>
            <input
              type="checkbox"
              checked={activeScreens.includes('converter')}
              onChange={() => clickCheckbox('converter')}
            />
            Конвертер валют
          </label>
        </div>
      </div>
      <div className="screens-wrapper">
        <div className="screen">
          {activeScreens.includes('allCurrencies') && <AllCurrenciesScreen />}
        </div>
        <div className="screen">
          {activeScreens.includes('currencyInDinamic') && <CurrencyInDinamicScreen />}
        </div>
        <div className="screen">
          {activeScreens.includes('converter') && <ConverterScreen />}
        </div>
      </div>
      
    </div>
  );
}

export default App;
