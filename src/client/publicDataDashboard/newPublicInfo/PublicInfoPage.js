import React from "react";
import PublicInfoHeader from "./header/PublicInfoHeader";
import { useMediaQuery } from "@material-ui/core";
import { SCREEN_SIZES } from "../../../sharedUtilities/constants";
import PublicInfoMenu from "./menu/PublicInfoMenu";
import PublicInfoBanner from "./PublicInfoBanner";
import ValuesSection from "./ValuesSection";
import StaffingShortage from "./staffingShortage/StaffingShortage";
import MythsAndFacts from "./mythsAndFacts/MythsAndFacts";
import DataVisSection from "./dataVis/DataVisSection";
import PublicInfoFooter from "./footer/PublicInfoFooter";

const PublicInfoPage = props => {
  const getScreen = () => {
    const isMobile = useMediaQuery("(max-width:430px)");
    const isTablet = useMediaQuery("(max-width:940px)");
    const isLaptop = useMediaQuery("(max-width:1480px)");

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
      <DataVisSection screenSize={screenSize} />
      <StaffingShortage screenSize={screenSize} />
      <MythsAndFacts screenSize={screenSize} />
      <PublicInfoFooter screenSize={screenSize} />
    </main>
  );
};

export default PublicInfoPage;
