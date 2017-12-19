import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import StyleGuide from './StyleGuide';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import customTheme from "./muiTheme";
import ViewAllCases from "./ViewAllCases";
import { Provider } from 'react-redux'
import store from './reduxStore'

const App = () => (
    <Provider store={store}>
        <Router>
            <MuiThemeProvider muiTheme={customTheme}>
                <div>
                    <Route exact path="/" component={ViewAllCases}/>
                    <Route path="/styleguide" component={StyleGuide}/>
                </div>
            </MuiThemeProvider>
        </Router>
    </Provider>
);

export default App;