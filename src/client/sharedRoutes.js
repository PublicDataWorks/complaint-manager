import { lazy } from "react";
const Login = lazy(() => import("./Login"));
const Logout = lazy(() => import("./Logout"));
const Callback = lazy(() => import("./Callback"));
const StyleGuide = lazy(() => import("./common/globalStyling/StyleGuide"));

const sharedRoutes = [
  {
    path: "/login",
    component: Login
  },
  {
    path: "/logout",
    component: Logout
  },
  {
    path: "/callback",
    component: Callback
  },
  {
    path: "/styleguide",
    component: StyleGuide,
    toggleName: "styleGuideFeature"
  }
];

export default sharedRoutes;
