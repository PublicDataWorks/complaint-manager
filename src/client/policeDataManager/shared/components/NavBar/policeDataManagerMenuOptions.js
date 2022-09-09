import { USER_PERMISSIONS } from "../../../../../sharedUtilities/constants";

export const policeDataManagerMenuOptions = [
  {
    path: "/dashboard",
    dataTestName: "dataDashboard",
    title: "Data Dashboard"
  },
  {
    path: "/export/all",
    dataTestName: "exports",
    title: "Export",
    permission: USER_PERMISSIONS.EDIT_CASE
  },
  {
    path: "/archived-cases",
    dataTestName: "archivedCases",
    title: "Archived Cases"
  },
  {
    path: "/manage-tags",
    dataTestName: "tagManagement",
    title: "Manage Tags"
  },
  {
    path: "/admin-portal",
    dataTestName: "admin",
    title: "Admin Portal",
    permission: USER_PERMISSIONS.ADMIN_ACCESS
  },
  {
    path: "/custom-config-page",
    dataTestName: "customConfigPage",
    title: "Custom Configuration Page",
    permission: USER_PERMISSIONS.ADMIN_ACCESS
  },
  {
    path: "/logout",
    dataTestName: "logOutButton",
    title: "Log Out"
  }
];
