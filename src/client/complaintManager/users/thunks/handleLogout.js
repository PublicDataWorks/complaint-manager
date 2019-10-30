import axios from "axios";
import Auth from "../../../common/auth/Auth";
import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";

const handleLogout = async () => {
  await axios
    .post(`api/audit`, JSON.stringify({ log: AUDIT_ACTION.LOGGED_OUT }))
    .catch(error => {
      console.log(error);
    });
  new Auth().logout();
};

export default handleLogout;
