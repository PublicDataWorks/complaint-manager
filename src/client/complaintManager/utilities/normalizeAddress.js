const normalizeAddress = address => {
  if (!address) {
    return;
  }
  if (address.streetAddress2) {
    address.streetAddress2 = address.streetAddress2.trim();
    return address;
  }
  return address;
};

export default normalizeAddress;
