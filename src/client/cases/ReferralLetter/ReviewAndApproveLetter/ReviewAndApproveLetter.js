import React, { Component } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import NavBar from "../../../shared/components/NavBar/NavBar";
import LinkButton from "../../../shared/components/LinkButton";
import { dateTimeFromString } from "../../../utilities/formatDate";
import getLetterPreview from "../thunks/getLetterPreview";
import { connect } from "react-redux";

class ReviewAndApproveLetter extends Component {
  constructor(props) {
    super(props);
    this.state = { caseId: this.props.match.params.id };
  }

  componentDidMount() {
    this.props.dispatch(getLetterPreview(this.state.caseId));
  }

  letterPreviewNotYetLoaded = () => {
    return this.props.letterHtml === "";
  };

  timestampIfEdited() {
    if (this.props.editHistory.edited) {
      return (
        <i style={{ fontSize: "0.9rem", color: "black" }}>
          (Last edited {dateTimeFromString(this.props.editHistory.lastEdited)})
        </i>
      );
    }
    return null;
  }

  render() {
    if (this.letterPreviewNotYetLoaded()) {
      return null;
    }

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            {`Case #${this.state.caseId}   : Letter Generation`}
          </Typography>
        </NavBar>

        <LinkButton
          data-test="save-and-return-to-case-link"
          //onClick={this.saveAndReturnToCase()}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Back to Case
        </LinkButton>
        <div style={{ margin: "0% 5% 3%", width: "60%" }}>
          <Typography
            style={{
              marginBottom: "24px"
            }}
            variant="title"
          >
            Review and Approve Letter {this.timestampIfEdited()}
          </Typography>
          <Card
            style={{
              marginBottom: "24px",
              backgroundColor: "white",
              overflow: "auto",
              width: "22rem"
            }}
          >
            <CardContent />
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
    editHistory: state.referralLetter.editHistory,
});
export default connect(mapStateToProps)(ReviewAndApproveLetter);
