import React, { Component } from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import NavBar from "../../../shared/components/NavBar/NavBar";
import LinkButton from "../../../shared/components/LinkButton";
import getLetterPreview from "../thunks/getLetterPreview";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { Document, Page } from "react-pdf/dist/entry.noworker";
import generatePdf from "../thunks/generatePdf";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  pageStyling: {
    borderBottom: `${theme.palette.secondary.main} 1px dotted`,
    "&:last-child": { borderBottom: "none" }
  }
});
class ReviewAndApproveLetter extends Component {
  constructor(props) {
    super(props);
    this.state = { caseId: this.props.match.params.id, numPages: null };
  }

  componentDidMount() {
    this.props.dispatch(getLetterPreview(this.state.caseId));
    this.props.dispatch(generatePdf(this.state.caseId));
  }

  letterPreviewNotYetLoaded = () => {
    return this.props.editHistory === "" || this.props.letterPdf === null;
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

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages
    });
  };

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
              width: "54rem",
              maxHeight: "55rem",
              overflow: "auto"
            }}
          >
            <CardContent>
              <Document
                file={this.props.letterPdf}
                onLoadSuccess={this.onDocumentLoadSuccess}
              >
                {Array.from(new Array(this.state.numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    scale={1.3}
                    className={this.props.classes.pageStyling}
                  />
                ))}
              </Document>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  editHistory: state.referralLetter.editHistory,
  letterPdf: state.referralLetter.letterPdf
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(ReviewAndApproveLetter)
);
