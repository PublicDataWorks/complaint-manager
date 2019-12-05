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
import RemoveCaseTagDialog from "../RemoveCaseTagDialog/RemoveCaseTagDialog";

class CaseTags extends Component {
  componentDidMount() {
    this.props.dispatch(getCaseTags(this.props.caseId));
  }

  render() {
    const { caseTags } = this.props;
    return (
      <div>
        <div style={{ margin: "0px 24px" }}>
          <div style={{ display: "flex" }}>
            <Typography
              data-test="caseTagDialogTitle"
              variant={"h6"}
              style={{
                marginBottom: "16px",
                flex: 1
              }}
            >
              Tags
            </Typography>
          </div>
          <div data-test="caseTagsContainer" style={{ paddingBottom: "16px" }}>
            {caseTags.length === 0 ? (
              <Typography variant="body2">No tags have been added</Typography>
            ) : (
              caseTags.map(caseTag => {
                return (
                  <Chip
                    style={{ margin: "5px" }}
                    key={caseTag.id}
                    label={caseTag && caseTag.tag.name}
                    data-test="caseTagChip"
                    onDelete={() =>
                      this.props.dispatch(openRemoveCaseTagDialog(caseTag))
                    }
                  />
                );
              })
            )}
          </div>
          <RemoveCaseTagDialog />
        </div>
        <LinkButton
          onClick={() => this.props.dispatch(openCaseTagDialog())}
          style={{ margin: "0% 0% 5% 2%" }}
          data-test="addTagButton"
        >
          + Add Tag
        </LinkButton>
        <CaseTagDialog />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  caseTags: state.currentCase.caseTags
});

export default connect(mapStateToProps)(CaseTags);
