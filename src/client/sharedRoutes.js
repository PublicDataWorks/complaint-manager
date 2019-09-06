import React from "react";
import Login from "./Login";
import Callback from "./Callback";

const sharedRoutes = [
  {
    path: "/login",
    component: Login
  },
  {
    path: "/callback",
    component: Callback
  }
];

export default sharedRoutes;
