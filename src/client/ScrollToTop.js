import { Component } from "react";

class ScrollToTop extends Component {
  componentDidUpdate() {
    scrollToTop();
  }

  render() {
    return this.props.children;
  }
}

export const scrollToTop = () => {
  if (document.getElementsByTagName("header").length > 0) {
    document.getElementsByTagName("header")[0].scrollIntoView(false);
  }
};

export default ScrollToTop;
