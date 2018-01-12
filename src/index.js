import React from 'react';
import { render } from 'react-dom';
import './index.css';
import registerServiceWorker from './client/registerServiceWorker';
import RootContainer from './client/RootContainer';

render(<RootContainer />, document.getElementById('root'));
registerServiceWorker();
