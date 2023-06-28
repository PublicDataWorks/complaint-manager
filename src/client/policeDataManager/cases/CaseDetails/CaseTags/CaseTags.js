import React, { Component } from "react";
import { Chip, Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import {
  openCaseTagDialog,
  openRemoveCaseTagDialog
} from "../../../actionCreators/casesActionCreators";
import { connect } from "react-redux";
import CaseTagDialog from "./CaseTagDialog";
import getCaseTags from "../../thunks/getCaseTags";
import RemoveCaseTagDialog from "./RemoveCaseTagDialog";
import { getTagsSuccess } from "../../../actionCreators/tagActionCreators";
import { USER_PERMISSIONS } from "../../../../../sharedUtilities/constants";

class CaseTags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      caseTagDialogOpen: false
    };
  }

  componentDidMount() {
    this.props.dispatch(getCaseTags(this.props.caseId));
  }

  componentWillUnmount() {
    this.props.dispatch(getTagsSuccess([]));
  }

  render() {
    const { caseTags } = this.props;
    return (
      <div>
        <div style={{ margin: "0px 24px" }}>
          <div style={{ display: "flex" }}>
            <Typography
              data-testid="caseTagTitle"
              variant={"h6"}
              style={{
                marginBottom: "16px",
                flex: 1
              }}
            >
              Tags
            </Typography>
          </div>
          <div
            data-testid="caseTagsContainer"
            style={{ paddingBottom: "16px" }}
          >
            {this.props.fetchingCaseTags === true ? null : caseTags.length ===
              0 ? (
              <Typography variant="body2">No tags have been added</Typography>
            ) : (
              caseTags.map(caseTag =>
                this.props.permissions?.includes(
                  USER_PERMISSIONS.ADD_TAG_TO_CASE
                ) ? (
                  <Chip
                    style={{ margin: "5px" }}
                    key={caseTag.id}
                    label={caseTag && caseTag.tag.name}
                    data-testid="caseTagChip"
                    onDelete={() =>
                      this.props.dispatch(openRemoveCaseTagDialog(caseTag))
                    }
                  />
                ) : (
                  <Chip
                    style={{ margin: "5px" }}
                    key={caseTag.id}
                    label={caseTag && caseTag.tag.name}
                    data-testid="caseTagChip"
                  />
                )
              )
            )}
          </div>
          <RemoveCaseTagDialog />
        </div>
        <div>
          {this.props.isArchived ||
          !this.props.permissions?.includes(
            USER_PERMISSIONS.ADD_TAG_TO_CASE
          ) ? (
            <div />
          ) : (
            <LinkButton
              onClick={() => this.setState({ caseTagDialogOpen: true })}
              style={{ margin: "0% 0% 5% 2%" }}
              data-testid="addTagButton"
            >
              + Add Tag
            </LinkButton>
          )}
        </div>
        <CaseTagDialog
          open={this.state.caseTagDialogOpen}
          closeDialog={() => this.setState({ caseTagDialogOpen: false })}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  caseTags: state.currentCase.caseTags,
  fetchingCaseTags: state.currentCase.fetchingCaseTags,
  isArchived: state.currentCase.details.isArchived,
  permissions: state?.users?.current?.userInfo?.permissions
});

export default connect(mapStateToProps)(CaseTags);
