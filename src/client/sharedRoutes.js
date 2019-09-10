import React from "react";
import Login from "./Login";
import Callback from "./Callback";
import StyleGuide from "./globalStyling/StyleGuide";

const sharedRoutes = [
  {
    path: "/login",
    component: Login
  },
  {
    path: "/callback",
    component: Callback
  },
  {
    path: "/styleguide",
    component: StyleGuide,
    toggleName: "preProdFeature"
  }
];

export default sharedRoutes;
