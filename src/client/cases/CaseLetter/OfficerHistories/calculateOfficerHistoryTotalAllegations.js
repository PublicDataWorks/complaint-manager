import { isIntegerString } from "../../../formFieldLevelValidations";

const calculateOfficerHistoryTotalAllegations = props => {
  const {
    numberHistoricalHighAllegations,
    numberHistoricalMediumAllegations,
    numberHistoricalLowAllegations
  } = props;
  let total = 0;
  total += getIntegerFromValue(numberHistoricalHighAllegations);
  total += getIntegerFromValue(numberHistoricalMediumAllegations);
  total += getIntegerFromValue(numberHistoricalLowAllegations);
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
