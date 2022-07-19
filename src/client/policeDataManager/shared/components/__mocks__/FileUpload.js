import React, { useEffect } from "react";

const MockFileUpload = props => {
  let dropzone;
  useEffect(() => {
    dropzone = {
      processQueue: () => {
        props.onSending({ name: "file.png" }, undefined, { append: () => {} });
        props.onSuccess();
        props.onComplete();
      },
      removeFile: () => {
        props.setAttachmentValid(false);
      }
    };
    props.onInit(dropzone);
    props.setAttachmentValid(true);
  }, []);

  return <section>{props.externalErrorMessage}</section>;
};

export default MockFileUpload;
