export const createUserSuccess = user => ({
  type: "USER_CREATED_SUCCESS",
  user
});

export const requestUserCreation = () => ({
  type: "USER_CREATION_REQUESTED"
});

export const createUserFailure = () => ({
  type: "USER_CREATION_FAILED"
});

export const getUsersSuccess = users => ({
  type: "GET_USERS_SUCCESS",
  users
});
