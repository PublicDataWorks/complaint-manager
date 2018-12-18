import config from "../../config/config";
import axios from "axios";
import Auth from "../../auth/Auth";
import { AUDIT_ACTION } from "../../../sharedUtilities/constants";

const handleLogout = async () => {
  const hostname = config[process.env.NODE_ENV].hostname;

  new Auth().logout();
  await axios.post(
    `${hostname}/api/audit`,
    JSON.stringify({ log: AUDIT_ACTION.LOGGED_OUT })
  ).catch(error => {
    console.log(error)
  });
};

export default handleLogout;
