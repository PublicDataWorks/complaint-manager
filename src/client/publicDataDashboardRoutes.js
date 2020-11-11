import React from "react";
import PublicDataDashboardWrapper from "./publicDataDashboard/PublicDataDashboard";
import DashboardAboutWrapper from "./publicDataDashboard/DashboardAbout";
import DashboardGlossaryWrapper from "./publicDataDashboard/DashboardGlossary";

const publicDataDashboardRoutes = [
  {
    path: "/data",
    component: PublicDataDashboardWrapper
  },
  {
    path: "/data/about",
    component: DashboardAboutWrapper
  },
  {
    path: "/data/glossary",
    component: DashboardGlossaryWrapper
  }
];

export default publicDataDashboardRoutes;
