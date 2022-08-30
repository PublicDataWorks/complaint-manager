import _ from "lodash";
import { UNKNOWN_OFFICER_NAME } from "../../../sharedUtilities/constants";

const validateLetterDetails = props => {
  const complainantCivilians =
    !props.caseDetails.complainantCivilians ||
    _.isEmpty(props.caseDetails.complainantCivilians);

  const complainantOfficers =
    !props.caseDetails.complainantOfficers ||
    _.isEmpty(props.caseDetails.complainantOfficers);

  if (complainantCivilians && complainantOfficers) {
    props.openMissingComplainantDialog();
    return false;
  }

  if (!props.allowAccusedOfficersToBeBlankFeature || props.accused.length > 0) {
    if (!props.letterOfficers || _.isEmpty(props.letterOfficers)) {
      props.openIncompleteOfficerHistoryDialog();
      return false;
    }
    for (let i = 0; i < props.letterOfficers.length; i++) {
      if (
        props.letterOfficers[i].fullName !== UNKNOWN_OFFICER_NAME &&
        !props.letterOfficers[i].officerHistoryOptionId
      ) {
        props.openIncompleteOfficerHistoryDialog(i);
        return false;
      }
    }

    if (_.isEmpty(props.classifications)) {
      props.openIncompleteClassificationsDialog();
      return false;
    }
  }
  return true;
};

export default validateLetterDetails;
