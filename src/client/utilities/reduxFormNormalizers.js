export const allegationFormNormalizer = values => {
  const normalizedValues = {};
  if (values.directive) {
    normalizedValues.directive = values.directive.trim();
  }
  return { ...values, ...normalizedValues };
};
