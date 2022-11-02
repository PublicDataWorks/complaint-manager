/*eslint no-control-regex: 0 */
import React from "react";
import LinkButton from "./LinkButton";
import { Typography } from "@material-ui/core";

const characterLimit = 400;

class TextTruncate extends React.Component {
  state = {
    isCollapsed: true
  };

  expandCollapseLinkStyles = {
    fontSize: "0.775rem",
    fontWeight: 400,
    textTransform: "none",
    padding: "0px 0px 1px 2px",
    minHeight: 0,
    minWidth: 0,
    letterSpacing: "1px"
  };

  showMore = () => {
    this.setState({ isCollapsed: false });
  };

  showLess = () => {
    this.setState({ isCollapsed: true });
  };

  getMessageDisplay = message => {
    if (this.props.getActivityNotes) {
      return this.renderActivityNotes(message);
    } else if (this.props.getDataSectionText) {
      return this.renderDashboardDataSection(message);
    } else {
      return (
        <Typography
          variant="body2"
          data-testid={this.props.testLabel}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {message}
        </Typography>
      );
    }
  };

  getDisplay = (message, buttonText, onButtonClick) => {
    return (
      <div>
        {this.getMessageDisplay(message)}
        <LinkButton
          style={this.expandCollapseLinkStyles}
          onClick={onButtonClick}
        >
          {buttonText}
        </LinkButton>
      </div>
    );
  };

  renderCollapsedState = message => {
    const truncatedMessage =
      message.substring(0, this.calcMsgIndex(message)) + "...";
    return this.getDisplay(truncatedMessage, "more", this.showMore);
  };

  renderCaption = message =>
    this.getDisplay(`${message}...`, "more", this.showMore);

  renderExpandedState = message => {
    return this.getDisplay(message, "less", this.showLess);
  };

  calcMsgIndex = msg => {
    const newlineIndex = this.parseNewlineIndex(msg);
    if (newlineIndex !== null) {
      return Math.min(newlineIndex, characterLimit);
    }
    return characterLimit;
  };

  parseNewlineIndex = msg => {
    const regex1 = RegExp("(\n){2,}", "g");
    const newlineIndex = regex1.exec(msg);
    return newlineIndex ? newlineIndex.index : null;
  };

  renderActivityNotes = msg => {
    return this.props.getActivityNotes(msg);
  };

  renderDashboardDataSection = msg => {
    return this.props.getDataSectionText(msg);
  };

  render() {
    const { message, collapsedText, testLabel, variant = "body2" } = this.props;
    const stringifiedMsg = String(message);

    if (
      this.parseNewlineIndex(message) === null &&
      stringifiedMsg.length <= characterLimit
    ) {
      return this.props.getActivityNotes ? (
        this.renderActivityNotes(stringifiedMsg)
      ) : (
        <Typography
          variant={variant}
          data-testid={testLabel}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {stringifiedMsg}
        </Typography>
      );
    }

    if (this.state.isCollapsed) {
      if (collapsedText) return this.renderCaption(collapsedText);
      return this.renderCollapsedState(stringifiedMsg);
    }
    return this.renderExpandedState(stringifiedMsg);
  }
}

export default TextTruncate;
