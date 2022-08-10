import { OPENID, PROFILE } from "../../../sharedUtilities/constants";

const parsePermissions = auth0Scope => {
  if (!auth0Scope) {
    return [];
  }

  const allScopeValues = auth0Scope.split(" ");
  const ignoredValues = [OPENID, PROFILE];
  return allScopeValues.filter(value => !ignoredValues.includes(value));
};

export default parsePermissions;
