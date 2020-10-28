import { isIntegerString } from "../../../../formFieldLevelValidations";

const calculateOfficerHistoryTotalAllegations = props => {
  const {
    numHistoricalHighAllegations,
    numHistoricalMedAllegations,
    numHistoricalLowAllegations
  } = props;
  let total = 0;
  total += getIntegerFromValue(numHistoricalHighAllegations);
  total += getIntegerFromValue(numHistoricalMedAllegations);
  total += getIntegerFromValue(numHistoricalLowAllegations);
  return total;
};

const getIntegerFromValue = value => {
  const error = isIntegerString(value);
  if (error === undefined) {
    return parseInt(value, 10) || 0;
  }
  return 0;
};

export default calculateOfficerHistoryTotalAllegations;
