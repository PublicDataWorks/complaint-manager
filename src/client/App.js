import React from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import StyleGuide from './globalStyling/StyleGuide';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import customTheme from "./globalStyling/muiTheme";
import CaseDashboard from "./cases/CaseDashboard";
import { Provider } from 'react-redux'
import store from './reduxStore'
import UserDashboard from './users/UserDashboard'
import {Paper} from "material-ui";
import colors from "./globalStyling/colors";

const App = () => (
    <Provider store={store}>
        <Router>
            <MuiThemeProvider theme={customTheme}>
                <Paper elevation={0} style={{height: '100vh', backgroundColor: colors.secondary[50]}}>
                    <Route exact path="/" component={CaseDashboard} />
                    <Route exact path="/styleguide" component={StyleGuide}/>
                    <Route exact path="/admin" component={UserDashboard}/>
                </Paper>
            </MuiThemeProvider>
        </Router>
    </Provider>
);

export default App;