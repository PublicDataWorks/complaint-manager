import React, { useState } from "react";
import { connect } from "react-redux";
import formatDate from "../../../../sharedUtilities/formatDate";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import { Drawer, IconButton, Typography } from "@material-ui/core";
import CaseNotes from "./CaseNotes/CaseNotes";
import CaseTags from "./CaseTags/CaseTags";
import ArchiveCaseButton from "./ArchiveCaseButton/ArchiveCaseButton";
import RestoreArchivedCaseButton from "./RestoreArchivedCaseButton/RestoreArchivedCaseButton";
import { resetWorkingCasesPaging } from "../../actionCreators/casesActionCreators";
import { USER_PERMISSIONS } from "../../../../sharedUtilities/constants";
import ReassignCaseDialog from "./ReassignCaseDialog/ReassignCaseDialog";
import SettingsIcon from "@material-ui/icons/Settings";

const renderArchiveOrRestoreButton = isArchived =>
  isArchived ? <RestoreArchivedCaseButton /> : <ArchiveCaseButton />;

const CaseDrawer = ({
  classes,
  caseDetails,
  resetWorkingCasesPaging,
  permissions
}) => {
  const lastDrawerRowClassName = classes.drawerRowEnd;
  const [gearDialogOpen, setGearDialogOpen] = useState(false);

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
            {permissions?.includes(USER_PERMISSIONS.ARCHIVE_CASE)
              ? renderArchiveOrRestoreButton(caseDetails.isArchived)
              : ""}
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
              <span style={{ display: "flex" }}>
                <Typography data-testid="assigned-to" variant="body2">
                  {caseDetails.assignedTo}
                </Typography>
                <IconButton
                  data-testid={"assignedToButton"}
                  style={{ paddingTop: "0px" }}
                  onClick={() => setGearDialogOpen(true)}
                >
                  <SettingsIcon />
                </IconButton>
              </span>
              <ReassignCaseDialog
                caseDetails={caseDetails}
                open={gearDialogOpen}
                setDialog={openState => setGearDialogOpen(openState)}
              ></ReassignCaseDialog>
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

export default connect(
  state => ({
    permissions: state?.users?.current?.userInfo?.permissions
  }),
  { resetWorkingCasesPaging }
)(CaseDrawer);
