import React from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import StyleGuide from './globalStyling/StyleGuide';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import customTheme from "./globalStyling/muiTheme";
import CaseDashboard from "./cases/CaseDashboard";
import UserDashboard from './users/UserDashboard'
import {Paper} from "material-ui";
import CaseDetails from "./caseDetails/CaseDetails";
import getCases from "./cases/thunks/getCases";
import {connect} from "react-redux";

class App extends React.Component {
  componentWillMount = () => {
    this.props.getCases()
  };

  render() {
    return (
      <Router>
          <MuiThemeProvider theme={customTheme}>
              <Paper elevation={0} style={{height: '100%', overflowY: 'scroll'}}>
                  <Route exact path="/" component={CaseDashboard}/>
                  <Route exact path="/case/:id" component={CaseDetails}/>
                {/*TODO Is there a good way to test this?*/}
                  <Route exact path="/styleguide" component={StyleGuide}/>
                  <Route exact path="/admin" component={UserDashboard}/>
              </Paper>
          </MuiThemeProvider>
      </Router>
    )
  }
}

const mapDispatchToProps = {
  getCases
};

export default connect(undefined, mapDispatchToProps)(App);