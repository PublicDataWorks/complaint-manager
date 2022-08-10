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
  if (!formattedAddress) {
    formattedAddress = "No address specified";
  }
  return (
    <div>
      <Typography variant="caption">{displayLabel}</Typography>
      <Typography variant="body2" data-testid={testLabel}>
        {formattedAddress}
      </Typography>
      <Typography
        variant="body2"
        data-testid={`${testLabel}AdditionalLocationInfo`}
      >
        {address && address.additionalLocationInfo
          ? address.additionalLocationInfo
          : ""}
      </Typography>
    </div>
  );
};

export default AddressInfoDisplay;
