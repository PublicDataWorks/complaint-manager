import { getPermissions } from "..";

export const parsePermissions = decodedToken => {
  return getPermissions(decodedToken.permissions);
};
