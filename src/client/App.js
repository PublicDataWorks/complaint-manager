import React from 'react';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import history from './history'
import StyleGuide from './globalStyling/StyleGuide';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import customTheme from "./globalStyling/muiTheme";
import CaseDashboard from "./cases/CaseDashboard";
import UserDashboard from './users/UserDashboard'
import { Paper } from "material-ui";
import Login from "./Login";
import Auth from './auth/Auth.js';
import Callback from "./Callback";
import CaseDetails from "./cases/CaseDetails/CaseDetails";

const auth = new Auth();

const handleAuthentication = ({location}) => {
    if (/access_token|id_token|error/.test(location.hash)) {
        auth.handleAuthentication();
    }
}

const App = () => (
    <ConnectedRouter history={history}>
        <MuiThemeProvider theme={customTheme}>
            <Paper elevation={0} style={{height: '100%', overflowY: 'scroll'}}>
                <Route path="/login" render={() => <Login auth={auth} />}/>
                <Route path="/callback" render={(props) => {
                    handleAuthentication(props);
                    return <Callback {...props} />
                }}/>
                <Route exact path="/" component={CaseDashboard}/>
                <Route exact path="/case/:id" component={CaseDetails}/>
                <Route exact path="/styleguide" component={StyleGuide}/>
                <Route exact path="/admin" component={UserDashboard}/>
            </Paper>
        </MuiThemeProvider>
    </ConnectedRouter>
)

export default App;