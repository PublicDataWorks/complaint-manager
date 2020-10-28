const generateRandomString = () => {
  return Math.random()
    .toString(36)
    .replace("0.", "");
};

export default generateRandomString;
