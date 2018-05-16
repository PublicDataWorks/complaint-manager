const formatPhoneNumber = phoneNumber => {
  if (phoneNumber) {
    const phoneString = phoneNumber.toString();

    const areaCode = phoneString.substring(0, 3);
    const first = phoneString.substring(3, 6);
    const second = phoneString.substring(6, 10);

    phoneNumber = `(${areaCode}) ${first}-${second}`;
  }

  return phoneNumber;
};

export default formatPhoneNumber;
