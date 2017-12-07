import React from 'react';
import { render } from 'react-dom';

import './index.css';
import App from './client/App';
import registerServiceWorker from './client/registerServiceWorker';

render(<App />, document.getElementById('root'));
registerServiceWorker();
