import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

const UsePageTracking = ({isTestModeEnabled = false}) => {
  const analyticsTrackingID = "UA-184896339-1";
  let location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    ReactGA.initialize(analyticsTrackingID, { testMode: isTestModeEnabled });
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [initialized, location]);

  return <div />;
};

export default UsePageTracking;
