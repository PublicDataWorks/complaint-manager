import React, { useEffect } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import PublicInfoHeader from "./PublicInfoHeader";
import { useMediaQuery } from "@material-ui/core";
import { SCREEN_SIZES } from "../../../sharedUtilities/constants";

const PublicInfoPage = props => {
  useEffect(() => {
    if (props.isAllowed === false) {
      props.dispatch(push("/data"));
    }
  }, [props.isAllowed]);

  const getScreen = () => {
    const isMobile = useMediaQuery("(max-width:430px)");
    const isTablet = useMediaQuery("(max-width:834px)");

    if (isMobile) {
      return SCREEN_SIZES.MOBILE;
    }

    if (isTablet) {
      return SCREEN_SIZES.TABLET;
    } else {
      return SCREEN_SIZES.DESKTOP;
    }
  };

  const screenSize = getScreen();

  if (!props.isAllowed) {
    return <main>Loading...</main>;
  } else {
    return (
      <main style={{ fontFamily: "Montserrat, sans-serif" }}>
        <PublicInfoHeader screenSize={screenSize} />
      </main>
    );
  }
};

export default connect(state => ({
  isAllowed: state.featureToggles.showNewPublicDashboard
}))(PublicInfoPage);
