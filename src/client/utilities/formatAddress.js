const formatAddress = address => {
  let formattedAddress = "";
  if (address) {
    const streetAddress = `${address.streetAddress || ""}`;
    const intersection = `${address.intersection || ""}`;
    const city = `${address.city || ""}`;
    const addressState = `${address.state || ""}`;
    const zipCode = `${address.zipCode || ""}`;
    const country = `${address.country || ""}`;

    let addressParts = [
      streetAddress,
      intersection,
      city,
      addressState,
      zipCode,
      country
    ].filter(part => part !== "");

    if (addressParts.length === 0) {
      formattedAddress = "";
    } else {
      formattedAddress = addressParts.join(", ").trim();
    }
  }

  return formattedAddress;
};

export default formatAddress;
