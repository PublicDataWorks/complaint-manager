import { ACCUSED } from "../../../../sharedUtilities/constants";

export default (isAnonymous, roleOnCase) => {
  return roleOnCase !== ACCUSED ? !!isAnonymous : false;
};
