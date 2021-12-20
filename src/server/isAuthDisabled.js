export const isAuthDisabled = () => {
  return (
    process.env.USE_CLOUD_SERVICES === false ||
    process.env.USE_CLOUD_SERVICES === "false" ||
    process.env.NODE_ENV === "demo"
  );
};
