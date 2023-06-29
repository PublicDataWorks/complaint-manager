import _ from "lodash";
import { retrieveSecretFromAWS } from "../../server/retrieveSecretFromAWS";
import NodeCache from "node-cache";
import {
  TTL_SEC,
  AUTH0_USERS_CACHE_KEY,
  FAKE_USERS
} from "../../sharedUtilities/constants";
import { isAuthDisabled } from "../../server/isAuthDisabled";
import okta from "@okta/okta-sdk-nodejs";

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];
const key = AUTH0_USERS_CACHE_KEY;

let users;
let cache = new NodeCache({ stdTTL: TTL_SEC });

export const delCacheUsers = () => {
  if (cache.has(key)) {
    return cache.del(key);
  }
};

export const getUsers = async () => {
  if (isAuthDisabled()) {
    return FAKE_USERS;
  }

  if (cache.has(key)) {
    users = cache.get(key);
    if (users) return users;
  }

  let userData = [];
  let secret = await getClientSecret();

  const client = new okta.Client({
    orgUrl: `https://${config.authentication.domain}`,
    token: secret
  });

  const collection = await client.userApi.listUsers();
  await collection.each(user => {
    const fullName = user.profile.firstName + " " + user.profile.lastName;
    userData.push({ email: user.profile.email, name: fullName });
  });
  cache.set(key, userData);
  return userData;
};

const getClientSecret = async () => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    return await retrieveSecretFromAWS(`ci/okta/backend`, "OKTA_CLIENT_SECRET");
  } else {
    return process.env.OKTA_CLIENT_SECRET;
  }
};
