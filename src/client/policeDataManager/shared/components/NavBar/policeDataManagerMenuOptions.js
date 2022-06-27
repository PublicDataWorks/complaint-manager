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
    title: "Export"
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
    path: "/logout",
    dataTestName: "logOutButton",
    title: "Log Out"
  }
];
