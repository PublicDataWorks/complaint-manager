import { get } from 'lodash';
import allConfigs from '../config/config';
import { NICKNAME, PERMISSIONS } from '../../sharedUtilities/constants';

const {
  audience,
  issuer,
  nicknameKey
} = get(allConfigs, [process.env.NODE_ENV, 'authentication'], {});

const localhostUserNickname = (request, response, next) => {
  const currentDate = Date.now();
  const expirationDate = currentDate + 86400;
  
  const fakeUser = {
    aud: audience,
    iss: issuer,
    [nicknameKey]: NICKNAME,
    scope: PERMISSIONS.join(' '),
    iat: currentDate,
    exp: expirationDate
  };

  request.nickname = NICKNAME;
  request.permissions = PERMISSIONS;
  request.user = fakeUser;
  
  return next();
};

export default localhostUserNickname;
