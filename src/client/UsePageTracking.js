import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const UsePageTracking = ({ isTestModeEnabled = false }) => {
  const analyticsTrackingID =
    process.env.REACT_APP_ANALYTICS_TRACKING_ID || "G-MGXREW1G4M";
  let location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log("Initializing GA");
    ReactGA.initialize(analyticsTrackingID, { testMode: isTestModeEnabled });
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      console.log("Reporting pageview", location.pathname, location.search);
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search
      });
    }
  }, [initialized, location]);

  return <div />;
};

export default UsePageTracking;
