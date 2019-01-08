import { merge } from "lodash";

export const mockCase = props => {
  const defaultProps = {
    createdBy: "fakeCreator",
    assignedTo: "fakeAssignee"
  };
  return merge(defaultProps, props);
};
