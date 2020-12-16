export const isAuthDisabled = () => {
  return (
    process.env.REACT_APP_CLOUD_SERVICES_DISABLED === true ||
    process.env.REACT_APP_CLOUD_SERVICES_DISABLED === "true"
  );
};
