export const isAuthDisabled = () => {
  return (
    process.env.CLOUD_SERVICES_DISABLED === true ||
    process.env.CLOUD_SERVICES_DISABLED === "true"
  );
};
