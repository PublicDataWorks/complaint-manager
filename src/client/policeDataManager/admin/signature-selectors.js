import { createSelector } from "reselect";

const getSigners = (state, props) => props.signers;
const getUsers = state => state.users.all;

const getSignerEmails = createSelector(getSigners, signers =>
  signers.map(signer => signer.nickname)
);

const getUserEmails = createSelector(getUsers, users =>
  users.map(user => user.email)
);

export const getFilteredUserEmails = createSelector(
  getUserEmails,
  getSignerEmails,
  (userEmails, signerEmails) =>
    userEmails.filter(user => !signerEmails.includes(user))
);
