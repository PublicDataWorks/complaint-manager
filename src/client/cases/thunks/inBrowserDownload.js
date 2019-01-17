import axios from "axios";

const inBrowserDownload = (path, htmlAnchorId, callback) => async dispatch => {
  try {
    const response = await axios.get(path);
    triggerDownload(htmlAnchorId, response);
  } catch (e) {
  } finally {
    if (callback) {
      callback();
    }
  }
};

const triggerDownload = (htmlAnchorId, response) => {
  const htmlAnchor = document.getElementById(htmlAnchorId);
  htmlAnchor.href = response.data;
  htmlAnchor.click();
};

export default inBrowserDownload;
