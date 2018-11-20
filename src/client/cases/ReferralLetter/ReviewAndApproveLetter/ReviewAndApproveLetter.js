import React, { Component } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import NavBar from "../../../shared/components/NavBar/NavBar";
import LinkButton from "../../../shared/components/LinkButton";
import getLetterPreview from "../thunks/getLetterPreview";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

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

  getTimestamp() {
    let timestamp;
    if (this.props.editHistory && this.props.editHistory.lastEdited) {
      const generatedDate = moment(
        this.props.editHistory.lastEdited,
        "MMM DD, YYYY"
      );
      timestamp = `This letter was last edited on ${generatedDate}`;
    } else {
      const today = moment(Date.now()).format("MMM DD, YYYY");
      timestamp = `This letter was generated on ${today}`;
    }
    return <i style={{ fontSize: "0.9rem", color: "black" }}>{timestamp}</i>;
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
          to={`/cases/${this.state.caseId}`}
          component={Link}
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
            Review and Approve Letter
          </Typography>
          <Typography
            data-test="edit-history"
            variant="body1"
            style={{ marginBottom: "24px" }}
          >
            {this.getTimestamp()}
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
  editHistory: state.referralLetter.editHistory
});
export default connect(mapStateToProps)(ReviewAndApproveLetter);
