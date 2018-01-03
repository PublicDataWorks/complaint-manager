import React from 'react';
import {connect} from 'react-redux'
import CasesTable from "./CasesTable";
import CreateCase from "./CreateCase";
import CaseCreationMessage from "./CaseCreationMessage";
import NavBar from '../NavBar'

const CaseDashboard = ({cases}) => {
    return (
        <div>
            <NavBar>View All Cases</NavBar>
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

export default connect(mapStateToProps)(CaseDashboard)