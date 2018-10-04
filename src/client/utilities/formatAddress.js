import React from "react";

const formatAddressAsString = address => {
  let formattedAddress = "";
  if (address) {
    const addressArray = getAddressArray(getAddressParts(address));
    if (addressArray.length !== 0) return addressArray.join(", ").trim();
  }
  return formattedAddress;
};

const formatAddressWithLineBreak = address => {
  let formattedAddress = "";
  if (address) {
    const addressParts = getAddressParts(address);
    const addressArray = getAddressArray(addressParts);

    if (addressArray.length !== 0) {
      formattedAddress = (
        <span>
          {addressParts.streetAddress}
          {addressParts.intersection}
          {lineBreak(addressParts)}
          {addressParts.city}, {addressParts.addressState}{" "}
          {addressParts.zipCode} {addressParts.country}
        </span>
      );
    }
    return formattedAddress;
  }
};

const lineBreak = addressParts => {
  if (addressParts.streetAddress || addressParts.intersection)
    return (
      <span>
        <br />
      </span>
    );
};

const getAddressArray = addressParts => {
  return Object.values(addressParts).filter(part => part !== "");
};

const getAddressParts = address => {
  const streetAddress = `${address.streetAddress || ""}`;
  const intersection = `${address.intersection || ""}`;
  const city = `${address.city || ""}`;
  const addressState = `${address.state || ""}`;
  const zipCode = `${address.zipCode || ""}`;
  const country = `${address.country || ""}`;

  return {
    streetAddress,
    intersection,
    city,
    addressState,
    zipCode,
    country
  };
};

export { formatAddressAsString, formatAddressWithLineBreak };
