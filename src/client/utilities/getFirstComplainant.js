import { COMPLAINANT } from "../../sharedUtilities/constants";

export default function getFirstComplainant(collection) {
  return collection.find(element => element.roleOnCase === COMPLAINANT);
}
