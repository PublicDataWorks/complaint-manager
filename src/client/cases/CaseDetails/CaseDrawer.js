import React from "react";
import formatDate from "../../utilities/formatDate";
import { Link } from "react-router-dom";
import LinkButton from "../../shared/components/LinkButton";
import { Drawer, Typography } from "@material-ui/core";
import RecentActivityContainer from "./RecentActivity/RecentActivityContainer";

const CaseDrawer = ({ classes, caseDetail }) => (
  <Drawer
    variant="permanent"
    anchor="left"
    classes={{
      paper: classes.drawerPaper
    }}
  >
    <div>
      <LinkButton
        data-test="all-cases-link"
        component={Link}
        to={"/"}
        style={{ margin: "4% 0% 5% 2%" }}
      >
        Back to all Cases
      </LinkButton>
      <Typography
        data-test="case-number"
        variant="title"
        style={{ marginLeft: "24px", marginTop: "4px" }}
        gutterBottom
      >
        {`Case #${caseDetail.id}`}
      </Typography>
      <div className={classes.drawerRow}>
        <div className={classes.drawerRowItem}>
          <Typography variant="caption">Created By</Typography>
          <Typography data-test="created-by" variant="body1">
            {caseDetail.createdBy}
          </Typography>
        </div>
        <div className={classes.drawerRowItem}>
          <Typography variant="caption">Created On</Typography>
          <Typography data-test="created-on" variant="body1">
            {formatDate(caseDetail.createdAt)}
          </Typography>
        </div>
        <div className={classes.drawerRowItem}>
          <Typography variant="caption">Complainant Type</Typography>
          <Typography data-test="complainant-type" variant="body1">
            {caseDetail.complainantType}
          </Typography>
        </div>
      </div>
      <div className={classes.drawerRowEnd}>
        <div className={classes.drawerRowItem}>
          <Typography variant="caption">Assigned To</Typography>
          <Typography data-test="assigned-to" variant="body1">
            {caseDetail.assignedTo}
          </Typography>
        </div>
        <div className={classes.drawerRowItem} />
        <div className={classes.drawerRowItem} />
      </div>
      <RecentActivityContainer />
    </div>
  </Drawer>
);

export default CaseDrawer;
