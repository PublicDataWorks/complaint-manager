import { Component } from "react";

class ScrollToTop extends Component {
  componentDidUpdate() {
    if (document.getElementsByTagName("header").length > 0) {
      document.getElementsByTagName("header")[0].scrollIntoView(false);
    }
  }

  render() {
    return this.props.children;
  }
}

export default ScrollToTop;
