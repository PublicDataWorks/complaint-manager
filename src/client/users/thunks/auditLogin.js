import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";
import axios from "axios";
import { AUDIT_ACTION } from "../../../sharedUtilities/constants";

const auditLogin = async () => {
  const hostname = config[process.env.NODE_ENV].hostname;
  const token = getAccessToken();
  try {
    await axios(`${hostname}/api/audit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      data: JSON.stringify({ log: AUDIT_ACTION.LOGGED_IN })
    });
  } catch (error) {
    console.log(error);
  }
};

export default auditLogin;
