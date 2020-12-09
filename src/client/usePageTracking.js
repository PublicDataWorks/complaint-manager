import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

const UsePageTracking = () => {
  const analyticsTrackingID = "UA-184896339-1";
  let location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log("Initializing Analytics");
    ReactGA.initialize(analyticsTrackingID);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      console.table(location);
      console.log("Page View", location.pathname);
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [initialized, location]);

  return <div />;
};

export default UsePageTracking;
