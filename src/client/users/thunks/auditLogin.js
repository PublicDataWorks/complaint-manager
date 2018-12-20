import axios from "axios";
import { AUDIT_ACTION } from "../../../sharedUtilities/constants";

const auditLogin = async () => {
  try {
    await axios.post(
      `api/audit`,
      JSON.stringify({ log: AUDIT_ACTION.LOGGED_IN })
    );
  } catch (error) {
    console.log(error);
  }
};

export default auditLogin;
