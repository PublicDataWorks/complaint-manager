const encodeUriWithParams = (url, queryParamObject) => {
  const encodedUri = Object.keys(queryParamObject)
    .map(
      k => encodeURIComponent(k) + "=" + encodeURIComponent(queryParamObject[k])
    )
    .join("&");

  return `${url}?${encodedUri}`;
};

export default encodeUriWithParams;
