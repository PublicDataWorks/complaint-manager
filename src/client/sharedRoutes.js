import React from "react";
import Login from "./Login";
import Logout from "./Logout";
import Callback from "./Callback";
import StyleGuide from "./common/globalStyling/StyleGuide";

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
