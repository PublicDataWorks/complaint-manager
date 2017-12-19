import React from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import StyleGuide from './globalStyling/StyleGuide';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import customTheme from "./globalStyling/muiTheme";
import ViewAllCases from "./cases/ViewAllCases";
import { Provider } from 'react-redux'
import store from './reduxStore'

const App = () => (
    <Provider store={store}>
        <Router>
            <MuiThemeProvider theme={customTheme}>
                <div>
                    <Route exact path="/" component={ViewAllCases}/>
                    <Route path="/styleguide" component={StyleGuide}/>
                </div>
            </MuiThemeProvider>
        </Router>
    </Provider>
);

export default App;