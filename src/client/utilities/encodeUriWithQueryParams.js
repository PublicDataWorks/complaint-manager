const encodeUriWithQueryParams = (url, queryParamObject) => {
  const queryParamKeys = Object.keys(queryParamObject);
  if (queryParamKeys.length > 0) {
    const encodedUri = queryParamKeys
      .map(
        k =>
          encodeURIComponent(k) + "=" + encodeURIComponent(queryParamObject[k])
      )
      .join("&");
    return `${url}?${encodedUri}`;
  } else {
    return url;
  }
};

export default encodeUriWithQueryParams;
