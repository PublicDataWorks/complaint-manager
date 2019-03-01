import { GET_INITIAL_DISCOVERY_SOURCES_SUCCEEDED } from "../../../sharedUtilities/constants";

const initialState = [];

const initialDiscoverySourceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INITIAL_DISCOVERY_SOURCES_SUCCEEDED:
      return action.initialDiscoverySources;
    default:
      return state;
  }
};

export default initialDiscoverySourceReducer;
