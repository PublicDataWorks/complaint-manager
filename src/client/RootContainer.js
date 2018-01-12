import React from 'react';
import { Provider } from 'react-redux';
import store from "./reduxStore";
import App from './App';

const RootContainer = () => {return(
  <Provider store={store}>
    <App />
  </Provider>
)};

export default RootContainer;