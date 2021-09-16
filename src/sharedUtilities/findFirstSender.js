const signatureKeys =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/content`).signatureKeys;

export const findFirstSender = sender => {
  const includedSenders = [];

  Object.keys(signatureKeys).forEach(key => {
    if (sender.includes(signatureKeys[key].name)) {
      includedSenders.push(key);
    }
  });

  includedSenders.sort((keyA, keyB) => {
    let indexA = sender.indexOf(signatureKeys[keyA].name);
    let indexB = sender.indexOf(signatureKeys[keyB].name);
    return indexA - indexB;
  });

  let firstSender = signatureKeys[includedSenders[0]];

  return firstSender ? firstSender.signature : null;
};
