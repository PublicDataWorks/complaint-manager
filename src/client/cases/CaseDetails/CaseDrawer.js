import React from 'react'
import {timeFromDateString} from "../../utilities/formatDate";
import {Link} from "react-router-dom";
import formatDate from "../../utilities/formatDate";
import LinkButton from "../../sharedComponents/LinkButton";
import {Drawer, Typography} from "material-ui";

const CaseDrawer = ({classes, caseDetail}) => (
    <Drawer
        type="permanent"
        anchor="left"
        classes={{
            paper: classes.drawerPaper,
        }}
    >
        <div>
            <LinkButton data-test="all-cases-link" component={Link} to={'/'} style={{margin: '4% 0% 5% 2%'}}>
                Back to all Cases
            </LinkButton>
            <Typography data-test="case-number" type="title" style={{marginLeft: "24px", marginTop: '4px'}}
                        gutterBottom>
                {`Case #${caseDetail.id}`}
            </Typography>
            <div className={classes.drawerRow}>
                <div className={classes.drawerRowItem}>
                    <Typography type='caption'>Incident Date</Typography>
                    <Typography data-test="incident-date" type='body1'>
                        {caseDetail.incidentDate ?
                            formatDate(caseDetail.incidentDate)
                            : 'N/A'
                        }
                    </Typography>
                </div>
                <div className={classes.drawerRowItem}>
                    <Typography type='caption'>Incident Time</Typography>
                    <Typography data-test="incident-time" type='body1'>
                        {caseDetail.incidentDate ?
                            timeFromDateString(caseDetail.incidentDate)
                            : 'N/A'
                        }
                    </Typography>
                </div>
                <div className={classes.drawerRowItem}>
                    <Typography type='caption'>First Contact Date</Typography>
                    <Typography data-test="first-contact-date" type='body1'>
                        {formatDate(caseDetail.firstContactDate)}
                    </Typography>
                </div>
            </div>
            <div className={classes.drawerRow}>
                <div className={classes.drawerRowItem}>
                    <Typography type='caption'>Complainant Type</Typography>
                    <Typography data-test="complainant-type"
                                type='body1'>{caseDetail.complainantType}</Typography>
                </div>
                <div className={classes.drawerRowItem}>
                </div>
                <div className={classes.drawerRowItem}>
                </div>
            </div>
            <div className={classes.drawerRow}>
                <div className={classes.drawerRowItem}>
                    <Typography type='caption'>Created On</Typography>
                    <Typography
                        data-test="created-on"
                        type='body1'>
                        {formatDate(caseDetail.createdAt)}
                    </Typography>
                </div>
                <div className={classes.drawerRowItem}>
                    <Typography type='caption'>Created By</Typography>
                    <Typography data-test="created-by"
                                type='body1'>{caseDetail.createdBy}</Typography>
                </div>
                <div className={classes.drawerRowItem}>
                    <Typography type='caption'>Assigned To</Typography>
                    <Typography data-test="assigned-to"
                                type='body1'>{caseDetail.assignedTo}</Typography>
                </div>
            </div>
        </div>
    </Drawer>
)

export default CaseDrawer