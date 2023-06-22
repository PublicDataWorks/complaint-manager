import React, { useEffect } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

const PublicInfoPage = props => {
  useEffect(() => {
    if (props.isAllowed === false) {
      props.dispatch(push("/data"));
    }
  }, [props.isAllowed]);

  if (!props.isAllowed) {
    return <main>Loading...</main>;
  } else {
    return <main>Hi, Mom!</main>;
  }
};

export default connect(state => ({
  isAllowed: state.featureToggles.showNewPublicDashboard
}))(PublicInfoPage);
