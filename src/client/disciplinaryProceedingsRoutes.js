import React from "react";
import { MemoList } from "./disciplinaryProceedings/memoList/MemoList";

const disciplinaryProceedingsRoutes = [
  {
    path: "/disciplinary-proceedings",
    component: MemoList,
    toggleName: "disciplinaryProceedingsFeature"
  }
];

export default disciplinaryProceedingsRoutes;
