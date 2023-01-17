import { useState, useEffect } from "react";
import axios from "axios";

/**
 * @typedef serviceDataReturnValue
 * @type {array}
 * @property {*} 0 - data returned from the service call (response.data)
 * @property {function} 1 - reload function, that if called will cause the API to be called again and the data replaced
 *
 * useGetServiceData - custom hook that stores the result of an API call in local state
 * @param {string} url the URL for the service call (will be passed to axios)
 * @param {*} defaultValue the value of the resultant state before the first successful service call
 * @param {string} method the HTTP method for the service call (default "get")
 * @returns {serviceDataReturnValue} an array, the first element of which is the data returned from the service, the second element is a function to trigger a reload of the data from the service
 */
const useGetServiceData = (url, defaultValue, method = "get") => {
  const [data, setData] = useState(defaultValue);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    if (reload) {
      axios[method](url)
        .then(result => {
          setData(result.data);
        })
        .catch(error => {
          console.error(error);
        });

      setReload(false);
    }
  }, [reload]);

  return [data, () => setReload(true)];
};

export default useGetServiceData;
