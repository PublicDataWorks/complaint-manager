const mockFflipObject = features => {
  return {
    has: featureName => {
      return features[featureName] && features[featureName] === true;
    }
  };
};

export default mockFflipObject;
