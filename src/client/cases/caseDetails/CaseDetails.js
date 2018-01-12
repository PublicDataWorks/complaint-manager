import React from 'react'
import {connect} from "react-redux"

const CaseDetails = () => ({

    render(){
        return this.props.caseDetail ? (<h2>{`Looking at Case Numero ${this.props.caseDetail.id}`}</h2>) : null
    }


//TODO: Back to all cases link button (refactor link button for reuse)
//TODO: Nav bar shows Last Name, First Initial and status in green box
//TODO: Permanent Drawer with case number, created on, created by, assigned to
})

const mapStateToProps = (state, ownProps) => ({
    caseDetail: state.cases.all.find((caseDetail) => caseDetail.id.toString() === ownProps.match.params.id)
})

export default connect(mapStateToProps)(CaseDetails)
