import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import { openCaseTagDialog } from "../../../actionCreators/casesActionCreators";
import { connect } from "react-redux";
import CaseTagDialog from "./CaseTagDialog";

class CaseTags extends Component {
  render() {
    return (
      <div>
        <div style={{ margin: "0px 24px" }}>
          <div style={{ display: "flex" }}>
            <Typography
              variant={"title"}
              style={{
                marginBottom: "16px",
                flex: 1
              }}
            >
              Tags
            </Typography>
          </div>
          <div data-test="caseTagsContainer" style={{ paddingBottom: "16px" }}>
            <Typography variant="body1">No tags have been added</Typography>
          </div>
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

export default connect()(CaseTags);
