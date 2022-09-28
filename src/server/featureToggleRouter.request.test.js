import Feature from "./testHelpers/feature";
import { cleanupDatabase } from "./testHelpers/requestTestHelpers";
import models from "./policeDataManager/models";
import { getFeaturesAsync } from "./featureToggleRouter";

describe("featureToggleRouter", function () {
  afterEach(async () => {
    await cleanupDatabase();
  });
  let feature, secondFeature;

  beforeEach(async () => {
    await cleanupDatabase();
    feature = new Feature.Builder()
      .defaultFeature()
      .withName("TEST_FEATURE")
      .withEnabled(true)
      .withIsDev(false)
      .build();
    let createdFeature = await models.feature_toggles.create(feature, {
      auditUser: "user"
    });
    secondFeature = new Feature.Builder()
      .defaultFeature()
      .withName("TEST_DISABLED_FEATURE")
      .withEnabled(false)
      .withIsDev(false)
      .build();
    await models.feature_toggles.create(secondFeature, {
      auditUser: "user"
    });
  });

  describe("getFeaturesAsync", function () {
    test("should return toggles", done => {
      const callback = features => {
        expect(features).toEqual(
          expect.arrayContaining([
            {
              id: feature.name,
              name: feature.name,
              description: feature.description,
              enabled: feature.enabled
            },
            {
              id: secondFeature.name,
              name: secondFeature.name,
              description: secondFeature.description,
              enabled: secondFeature.enabled
            }
          ])
        );
        done();
      };
      getFeaturesAsync(callback);
    });
  });
});
