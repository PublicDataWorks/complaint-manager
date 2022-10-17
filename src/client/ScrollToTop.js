import { useEffect } from "react";
import { withRouter } from "react-router";

const ScrollToTop = props => {
  useEffect(() => {
    scrollToTop();
  });

  return props.children;
};

export const scrollToTop = () => {
  if (document.getElementsByTagName("header").length > 0) {
    document.getElementsByTagName("header")[0].scrollIntoView(false);
  }
};

export default withRouter(ScrollToTop);
