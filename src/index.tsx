import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ConfigData from './components/contexts/ConfigData';
import { store } from './store/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    //<React.StrictMode>
        <ConfigData>
            <BrowserRouter>
                <Provider store={store}> 
                    <App />
                </Provider>
            </BrowserRouter>
        </ConfigData>
    //</React.StrictMode>
);

reportWebVitals();
