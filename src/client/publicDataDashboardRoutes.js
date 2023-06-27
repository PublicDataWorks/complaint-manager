import { lazy } from "react";
const PublicInfoPage = lazy(() =>
  import("./publicDataDashboard/newPublicInfo/PublicInfoPage")
);
const PublicDataDashboardWrapper = lazy(() =>
  import("./publicDataDashboard/PublicDataDashboard")
);
const DashboardAboutWrapper = lazy(() =>
  import("./publicDataDashboard/DashboardAbout")
);
const DashboardGlossaryWrapper = lazy(() =>
  import("./publicDataDashboard/DashboardGlossary")
);

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
    title: "IPM Complaints Data - Tag Glossary",
    component: DashboardGlossaryWrapper
  },
  {
    path: "/public-data",
    title: "Information Dashboard",
    component: PublicInfoPage
  }
];

export default publicDataDashboardRoutes;
