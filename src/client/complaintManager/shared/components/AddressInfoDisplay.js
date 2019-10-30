import React from "react";
import {
  formatAddressAsString,
  formatAddressWithLineBreak
} from "../../utilities/formatAddress";
import { Typography } from "@material-ui/core";

const AddressInfoDisplay = ({
  testLabel,
  displayLabel,
  address,
  useLineBreaks
}) => {
  let formattedAddress = useLineBreaks
    ? formatAddressWithLineBreak(address)
    : formatAddressAsString(address);
  if (!Boolean(formattedAddress)) {
    formattedAddress = "No address specified";
  }
  return (
    <div>
      <Typography variant="caption">{displayLabel}</Typography>
      <Typography variant="body1" data-test={testLabel}>
        {formattedAddress}
      </Typography>
      <Typography
        variant="body1"
        data-test={`${testLabel}AdditionalLocationInfo`}
      >
        {address && address.additionalLocationInfo
          ? address.additionalLocationInfo
          : ""}
      </Typography>
    </div>
  );
};

export default AddressInfoDisplay;
