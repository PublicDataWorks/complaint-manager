"use strict";

import { getPersonFullName } from "./getFullName";
import { pick, isEmpty } from "lodash";

export const getPrimaryComplainant = ({
  complainantPersonType: personType,
  complainantIsAnonymous: isAnonymous,
  ...otherFields
}) => {
  if (isEmpty(otherFields)) return null;

  const fullName = getPersonFullName(
    otherFields["complainantFirstName"],
    otherFields["complainantMiddleInitial"],
    otherFields["complainantLastName"],
    otherFields["complainantSuffix"],
    otherFields["complainantPersonType"]
  );

  return { personType, fullName, isAnonymous };
};
