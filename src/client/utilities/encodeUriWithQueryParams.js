const encodeUriWithQueryParams = (url, queryParamObject) => {
  const encodedUri = Object.keys(queryParamObject)
    .map(
      k => encodeURIComponent(k) + "=" + encodeURIComponent(queryParamObject[k])
    )
    .join("&");

  return `${url}?${encodedUri}`;
};

export default encodeUriWithQueryParams;
