import { isAuthDisabled } from "../isAuthDisabled";

export const authEnabledTest = () => {
  if (isAuthDisabled()) {
    console.warn("Skipping test, Auth is disabled.");
  }
  return isAuthDisabled() ? it.skip : it;
};
