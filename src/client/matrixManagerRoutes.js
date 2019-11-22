import React from "react";
import MatrixList from "./matrixManager/matrices/MatrixList/MatrixList";

const matrixManagerRoutes = [
  {
    path: "/matrices",
    component: MatrixList,
    toggleName: "matrixManagerFeature"
  }
];

export default matrixManagerRoutes;
