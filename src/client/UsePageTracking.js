import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

const UsePageTracking = ({ isTestModeEnabled = false }) => {
  const analyticsTrackingID = "UA-184896339-1";
  let location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log("Initializing GA");
    ReactGA.initialize(analyticsTrackingID, { testMode: isTestModeEnabled });
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      console.log(
        "Reporting pageview",
        location.pathname,
        location.search
      );
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [initialized, location]);

  return <div />;
};

export default UsePageTracking;
