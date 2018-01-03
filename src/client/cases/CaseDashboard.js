import React from 'react';
import {connect} from 'react-redux'
import CasesTable from "./CasesTable";
import CreateCase from "./CreateCase";
import CaseCreationSnackbar from "./CaseCreationSnackbar";
import NavBar from '../NavBar'

const CaseDashboard = ({cases}) => {
    return (
        <div>
            <NavBar>View All Cases</NavBar>
            <CreateCase/>
            <CasesTable cases={cases}/>
            <CaseCreationSnackbar/>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        cases: state.cases.all
    }
}

export default connect(mapStateToProps)(CaseDashboard)