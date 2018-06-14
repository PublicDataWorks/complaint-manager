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
    const truncatedMessage = message.substring(0, characterLimit) + "...";
    return this.getDisplay(truncatedMessage, "(show more)", this.showMore);
  };

  renderExpandedState = message => {
    return this.getDisplay(message, "(show less)", this.showLess);
  };

  render() {
    const { message, testLabel } = this.props;
    const stringifiedMessage = String(message);

    if (stringifiedMessage.length <= characterLimit) {
      return (
        <Typography
          variant="body1"
          data-test={testLabel}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {stringifiedMessage}
        </Typography>
      );
    }

    if (this.state.isCollapsed) {
      return this.renderCollapsedState(stringifiedMessage);
    }
    return this.renderExpandedState(stringifiedMessage);
  }
}

export default TextTruncate;
