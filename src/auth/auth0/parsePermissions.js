import { OPENID, PROFILE } from "../../sharedUtilities/constants";

export const parsePermissions = decodedToken => {
  const auth0Scope = decodedToken.scope;
  if (!Boolean(auth0Scope)) {
    return [];
  }

  const allScopeValues = auth0Scope.split(" ");
  const ignoredValues = [OPENID, PROFILE];
  return allScopeValues.filter(value => !ignoredValues.includes(value));
};
