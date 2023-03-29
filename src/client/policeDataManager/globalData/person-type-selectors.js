import { createSelector } from "reselect";

export const getDefaultPersonType = createSelector(
  state => state.personTypes,
  personTypes => personTypes.find(type => type.isDefault)
);

export const getSelectedPersonType = createSelector(
  state => state.personTypes,
  (_, complainantType) => complainantType,
  (personTypes, complainantType) =>
    personTypes.find(type => type.key === complainantType)
);
