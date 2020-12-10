import { SIGNATURE_KEYS } from "./constants";

export const findFirstSender = sender => {
  const includedSenders = [];

  Object.keys(SIGNATURE_KEYS).forEach(key => {
    if (sender.includes(SIGNATURE_KEYS[key].name)) {
      includedSenders.push(key);
    }
  });

  includedSenders.sort((keyA, keyB) => {
    let indexA = sender.indexOf(SIGNATURE_KEYS[keyA].name);
    let indexB = sender.indexOf(SIGNATURE_KEYS[keyB].name);
    return indexA - indexB;
  });

  let firstSender = SIGNATURE_KEYS[includedSenders[0]];

  return firstSender ? firstSender.signature : null;
};
