import { createSelector } from "reselect";

export const mapCaseStatuses = createSelector(
  state => state.ui.caseStatuses,
  statuses =>
    statuses.reduce((acc, elem) => {
      if (!acc[elem.name]) {
        acc[elem.name] = elem.orderKey;
      }
      return acc;
    }, {})
);
