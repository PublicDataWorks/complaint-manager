import React from "react";
import PublicDataDashboardWrapper from "./publicDataDashboard/PublicDataDashboard";
import DashboardAboutWrapper from "./publicDataDashboard/DashboardAbout";

const publicDataDashboardRoutes = [
  {
    path: "/data",
    component: PublicDataDashboardWrapper
  },
  {
    path: "/data/about",
    component: DashboardAboutWrapper
  }
];

export default publicDataDashboardRoutes;
