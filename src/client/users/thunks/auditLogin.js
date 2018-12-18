import config from "../../config/config";
import axios from "axios";
import { AUDIT_ACTION } from "../../../sharedUtilities/constants";

const auditLogin = async () => {
  const hostname = config[process.env.NODE_ENV].hostname;
  try {
    await axios.post(
      `${hostname}/api/audit`,
      JSON.stringify({ log: AUDIT_ACTION.LOGGED_IN })
    );
  } catch (error) {
    console.log(error);
  }
};

export default auditLogin;
