const checkFeatureToggleEnabled = (request, featureName) => {
  if (!request.fflip) {
    return false;
  }
  return request.fflip.has(featureName);
};

export default checkFeatureToggleEnabled;
