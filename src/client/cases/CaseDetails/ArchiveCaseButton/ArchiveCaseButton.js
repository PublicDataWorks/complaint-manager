import LinkButton from "../../../shared/components/LinkButton";
import React, { Component } from "react";
import { connect } from "react-redux";

class ArchiveCaseButton extends Component {
  render() {
    if (!this.props.featureToggles.archiveCaseFeature) {
      return null;
    }
    return (
      <LinkButton style={{ textAlign: "right", marginBottom: "16px" }}>
        Archive Case
      </LinkButton>
    );
  }
}

const mapStateToProps = state => ({
  featureToggles: state.featureToggles
});

export default connect(mapStateToProps)(ArchiveCaseButton);
