const checkFeatureToggleEnabled = (request, featureName) => {
  return request.fflip && request.fflip.has(featureName);
};

export default checkFeatureToggleEnabled;
