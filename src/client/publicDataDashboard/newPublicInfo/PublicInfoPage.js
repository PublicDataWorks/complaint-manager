import React from "react";
import PublicInfoHeader from "./header/PublicInfoHeader";
import { useMediaQuery } from "@material-ui/core";
import { SCREEN_SIZES } from "../../../sharedUtilities/constants";
import PublicInfoMenu from "./menu/PublicInfoMenu";
import PublicInfoBanner from "./PublicInfoBanner";
import ValuesSection from "./ValuesSection";
import StaffingShortage from "./staffingShortage/StaffingShortage";

const PublicInfoPage = props => {
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

  return (
    <main style={{ fontFamily: "Montserrat, sans-serif" }}>
      <PublicInfoHeader screenSize={screenSize} />
      <PublicInfoMenu screenSize={screenSize} />
      <PublicInfoBanner screenSize={screenSize} />
      <ValuesSection screenSize={screenSize} />
      <StaffingShortage screenSize={screenSize} />
    </main>
  );
};

export default PublicInfoPage;
