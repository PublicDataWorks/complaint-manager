export const isAuthDisabled = () => {
  return (
    process.env.NODE_AUTH_DISABLED === true ||
    process.env.NODE_AUTH_DISABLED === "true"
  );
};
