"use strict";

import { getPersonFullName } from "./getFullName";
import { isEmpty } from "lodash";

export const getPrimaryComplainant = ({
  complainantPersonType: personType,
  complainantIsAnonymous: isAnonymous,
  ...otherFields
}) => {
  if (isEmpty(otherFields)) return null;

  const fullName = getPersonFullName(
    otherFields["complainantFirstName"],
    otherFields["complainantMiddleName"],
    otherFields["complainantLastName"],
    otherFields["complainantSuffix"],
    otherFields["complainantPersonType"]
  );

  return { personType, fullName, isAnonymous };
};
