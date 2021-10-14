import React from "react";
import { connect } from "react-redux";
import formatDate from "../../../../sharedUtilities/formatDate";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import { Drawer, Typography } from "@material-ui/core";
import CaseNotes from "./CaseNotes/CaseNotes";
import CaseTags from "./CaseTags/CaseTags";
import ArchiveCaseButton from "./ArchiveCaseButton/ArchiveCaseButton";
import RestoreArchivedCaseButton from "./RestoreArchivedCaseButton/RestoreArchivedCaseButton";
import { resetWorkingCasesPaging } from "../../actionCreators/casesActionCreators";

const renderArchiveOrRestoreButton = isArchived =>
  isArchived ? <RestoreArchivedCaseButton /> : <ArchiveCaseButton />;

const CaseDrawer = ({ classes, caseDetails, resetWorkingCasesPaging }) => {
  const lastDrawerRowClassName = classes.drawerRowEnd;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div>
        <LinkButton
          data-testid="all-cases-link"
          component={Link}
          to={"/"}
          style={{ margin: "4% 0% 5% 2%" }}
          onClick={resetWorkingCasesPaging}
        >
          Back to all Cases
        </LinkButton>
        <div style={{ margin: "0px 24px" }}>
          <div style={{ display: "flex" }}>
            <Typography
              data-testid="case-reference"
              variant="h6"
              style={{
                marginTop: "4px",
                flex: 1
              }}
              gutterBottom
            >
              {`Case #${caseDetails.caseReference}`}
            </Typography>
            {renderArchiveOrRestoreButton(caseDetails.isArchived)}
          </div>
          <div className={classes.drawerRow}>
            <div className={classes.drawerRowItem}>
              <Typography variant="caption">Created By</Typography>
              <Typography data-testid="created-by" variant="body2">
                {caseDetails.createdBy}
              </Typography>
            </div>
          </div>
          <div className={lastDrawerRowClassName}>
            <div className={classes.drawerRowItem}>
              <Typography variant="caption">Created On</Typography>
              <Typography data-testid="created-on" variant="body2">
                {formatDate(caseDetails.createdAt)}
              </Typography>
            </div>
            <div className={classes.drawerRowItem}>
              <Typography variant="caption">Complaint Type</Typography>
              <Typography data-testid="complaint-type" variant="body2">
                {caseDetails.complaintType}
              </Typography>
            </div>
          </div>
          <div className={classes.drawerRowEnd}>
            <div className={classes.drawerRowItem}>
              <Typography variant="caption">Assigned To</Typography>
              <Typography data-testid="assigned-to" variant="body2">
                {caseDetails.assignedTo}
              </Typography>
            </div>
            <div className={classes.drawerRowItem} />
            <div className={classes.drawerRowItem} />
          </div>
        </div>
        <CaseTags />
        <CaseNotes />
      </div>
    </Drawer>
  );
};

export default connect(undefined, { resetWorkingCasesPaging })(CaseDrawer);
