import { createSelector } from "reselect";

export const getNameOfUser = createSelector(
  state => state.users.all,
  (state, user) => user,
  (users, user) => {
    for (let userObject of users) {
      if (userObject.email === user) {
        return userObject.name;
      }
    }
  }
);
