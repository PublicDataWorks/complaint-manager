import React from "react";
import PublicDataDashboardWrapper from "./publicDataDashboard/PublicDataDashboard";
import DashboardAboutWrapper from "./publicDataDashboard/DashboardAbout";
import DashboardGlossaryWrapper from "./publicDataDashboard/DashboardGlossary";

const publicDataDashboardRoutes = [
  {
    path: "/data",
    title: "IPM Complaints Data",
    component: PublicDataDashboardWrapper
  },
  {
    path: "/data/about",
    title: "IPM Complaints Data - About",
    component: DashboardAboutWrapper
  },
  {
    path: "/data/glossary",
    title: "IPM Complaints Data - Glossary",
    component: DashboardGlossaryWrapper
  }
];

export default publicDataDashboardRoutes;
