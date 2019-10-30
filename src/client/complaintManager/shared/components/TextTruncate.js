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

  getDisplay = (message, buttonText, onButtonClick) => {
    return (
      <Typography
        variant="body1"
        data-test={this.props.testLabel}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {message}
        <LinkButton
          style={this.expandCollapseLinkStyles}
          onClick={onButtonClick}
        >
          {buttonText}
        </LinkButton>
      </Typography>
    );
  };

  renderCollapsedState = message => {
    const truncatedMessage =
      message.substring(0, this.calcMsgIndex(message)) + "...";
    return this.getDisplay(truncatedMessage, "(show more)", this.showMore);
  };

  renderExpandedState = message => {
    return this.getDisplay(message, "(show less)", this.showLess);
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

  render() {
    const { message, testLabel } = this.props;
    const stringifiedMsg = String(message);

    if (
      this.parseNewlineIndex(message) === null &&
      stringifiedMsg.length <= characterLimit
    ) {
      return (
        <Typography
          variant="body1"
          data-test={testLabel}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {stringifiedMsg}
        </Typography>
      );
    }

    if (this.state.isCollapsed) {
      return this.renderCollapsedState(stringifiedMsg);
    }
    return this.renderExpandedState(stringifiedMsg);
  }
}

export default TextTruncate;
