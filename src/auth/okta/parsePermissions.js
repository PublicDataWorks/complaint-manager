import { getPermissions } from "..";

export const parsePermissions = decodedToken => {
  return getPermissions(undefined, decodedToken.perms);
};
