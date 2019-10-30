import { GET_ALLEGATIONS_SUCCEEDED } from "../../../../sharedUtilities/constants";

const allegationMenuDisplay = (state = [], action) => {
  if (action.type === GET_ALLEGATIONS_SUCCEEDED) {
    return action.allegations;
  }

  return state;
};

export default allegationMenuDisplay;
