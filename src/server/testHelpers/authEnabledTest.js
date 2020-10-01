import allConfigs from "../config/config";
import { get } from "lodash";

export const authEnabledTest = () => {
  const isAuthDisabled = authDisabled();
  if (isAuthDisabled) {
    console.warn("Skipping test, Auth is disabled.");
  }
  return isAuthDisabled ? it.skip : it;
};

export const authDisabled = () => {
  const currentConfig = allConfigs[process.env.NODE_ENV] || {};
  const isAuthDisabled = get(
    currentConfig,
    ["authentication", "disabled"],
    false
  );
  return isAuthDisabled;
};
