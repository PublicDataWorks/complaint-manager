import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";
import Auth from "../../auth/Auth";
import { AUDIT_ACTION } from "../../../sharedUtilities/constants";

const handleLogout = async () => {
  const hostname = config[process.env.NODE_ENV].hostname;
  const token = getAccessToken();

  new Auth().logout();
  await fetch(`${hostname}/api/audit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ log: AUDIT_ACTION.LOGGED_OUT })
  }).catch(error => {
    console.log(error);
  });
};

export default handleLogout;
