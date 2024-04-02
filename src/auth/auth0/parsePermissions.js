import { OPENID, PROFILE } from "../../sharedUtilities/constants";

export const parsePermissions = decodedToken => {
  const auth0Scope = Array.isArray(decodedToken.permissions)
    ? decodedToken.permissions.join(" ")
    : [];

  if (!Boolean(auth0Scope)) {
    return [];
  }

  const allScopeValues = auth0Scope.split(" ");
  const ignoredValues = [OPENID, PROFILE];
  return allScopeValues.filter(value => !ignoredValues.includes(value));
};
