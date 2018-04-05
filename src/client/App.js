import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';
import history from './history'
import StyleGuide from './globalStyling/StyleGuide';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import customTheme from "./globalStyling/muiTheme";
import CaseDashboard from "./cases/CaseDashboard";
import UserDashboard from './users/UserDashboard'
import {Paper} from "material-ui";
import Login from "./Login";
import Callback from "./Callback";
import CaseDetails from "./cases/CaseDetails/CaseDetails";
import {connect} from "react-redux";
import {userAuthSuccess} from "./auth/actionCreators";
import getAccessToken from "./auth/getAccessToken";
import Auth from "./auth/Auth";
import OfficerDashboard from "./officers/OfficerDashboard";

class App extends Component {

    componentDidMount() {
        const accessToken = getAccessToken()
        if (accessToken) {
           const auth = new Auth();
           auth.setUserInfo(accessToken, this.props.userAuthSuccess)
        }
    }

    render() {
        return (
            <ConnectedRouter history={history}>
                <MuiThemeProvider theme={customTheme}>
                    <Paper elevation={0} style={{height: '100%', overflowY: 'scroll'}}>
                        <Route path="/login" component={Login}/>
                        <Route path="/callback" component={Callback}/>
                        <Route exact path="/" component={CaseDashboard}/>
                        <Route exact path="/cases/:id/officers/search" component={OfficerDashboard}/>
                        <Route exact path="/cases/:id" component={CaseDetails}/>
                        <Route exact path="/styleguide" component={StyleGuide}/>
                        <Route exact path="/admin" component={UserDashboard}/>
                    </Paper>
                </MuiThemeProvider>
            </ConnectedRouter>
        )
    }

}

const mapDispatchToProps = {
    userAuthSuccess
}

export default connect(undefined, mapDispatchToProps)(App)