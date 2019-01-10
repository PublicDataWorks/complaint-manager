import React, { Component } from "react";
import { connect } from "react-redux";
import { openArchiveCaseDialog } from "../../../actionCreators/casesActionCreators";
import LinkButton from "../../../shared/components/LinkButton";
import ArchiveCaseDialog from "../ArchiveCaseDialog/ArchiveCaseDialog";

class ArchiveCaseButton extends Component {
  render() {
    if (!this.props.featureToggles.archiveCaseFeature) {
      return null;
    }
    return (
      <div>
        <LinkButton
          onClick={this.props.openArchiveCaseDialog}
          style={{ textAlign: "right", marginBottom: "16px" }}
          data-test="archiveCaseButton"
        >
          Archive Case
        </LinkButton>
        <ArchiveCaseDialog />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  featureToggles: state.featureToggles
});

const mapDispatchToProps = {
  openArchiveCaseDialog
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArchiveCaseButton);
