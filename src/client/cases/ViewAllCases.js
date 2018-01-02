import React from 'react';
import HomeIcon from 'material-ui-icons/Home';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import {AppBar, IconButton, Toolbar, Typography} from 'material-ui'
import {connect} from 'react-redux'
import CasesTable from "./CasesTable";
import CreateCase from "./CreateCase";
import CaseCreationMessage from "./CaseCreationMessage";

const ViewAllCases = ({cases}) => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton>
                        <HomeIcon/>
                    </IconButton>
                    <Typography
                        data-test="pageTitle"
                        type="title"
                        color="inherit"
                    >
                        View All Cases
                    </Typography>
                    <IconButton>
                        <AccountCircleIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <CreateCase/>
            <CasesTable cases={cases}/>
            <CaseCreationMessage/>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        cases: state.cases.all
    }
}

export default connect(mapStateToProps)(ViewAllCases)