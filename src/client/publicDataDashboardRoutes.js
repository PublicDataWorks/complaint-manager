import React from "react";
import PublicDataDashboard from "./publicDataDashboard/PublicDataDashboard";
import DashboardAbout from "./publicDataDashboard/DashboardAbout";

const publicDataDashboardRoutes = [
  {
    path: "/data",
    component: PublicDataDashboard
  },
  {
    path: "/data/about",
    component: DashboardAbout
  }
];

export default publicDataDashboardRoutes;
