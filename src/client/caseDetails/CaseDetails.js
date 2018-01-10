import React from 'react'

const CaseDetails = ({match}) => (<h2>{`Looking at Case# ${match.params.id}`}</h2>)

//TODO: Back to all cases link button (refactor link button for reuse)
//TODO: Nav bar shows Last Name, First Initial and status in green box
//TODO: Permanent Drawer with case number, created on, created by, assigned to

export default CaseDetails
