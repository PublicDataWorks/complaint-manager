export const parsePermissions = decodedToken => {
  return Array.isArray(decodedToken.permissions)
    ? decodedToken.permissions
    : [];
};
