import { GET_INITIAL_DISCOVERY_SOURCES_SUCCEEDED } from "../../sharedUtilities/constants";

export const getInitialDiscoverySourcesSuccess = initialDiscoverySources => ({
  type: GET_INITIAL_DISCOVERY_SOURCES_SUCCEEDED,
  initialDiscoverySources
});
