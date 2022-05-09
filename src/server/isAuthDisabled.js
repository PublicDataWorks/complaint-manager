export const isAuthDisabled = () => {
  return (
    process.env.REACT_APP_USE_CLOUD_SERVICES === false ||
    process.env.REACT_APP_USE_CLOUD_SERVICES === "false" ||
    process.env.NODE_ENV === "demo"
  );
};
