import { isAuthDisabled } from "../../isAuthDisabled";

export default () => {
  return isAuthDisabled() ? "MOCK_TOKEN" : localStorage.getItem("access_token");
};
