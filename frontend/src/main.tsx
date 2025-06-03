import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import '../static/index.css';
import '../static/HomePage.css'; // Add this line
<<<<<<< HEAD
import '../static/LoginRegister.css'; // Add this line

=======
import '../static/NotFoundPage.css'; // Add this line
>>>>>>> 89c7c017f0174ef35b1aa99d4282d860732f5235
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);