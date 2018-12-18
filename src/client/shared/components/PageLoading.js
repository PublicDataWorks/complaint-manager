import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

const PageLoading = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "200px" }}>
      <CircularProgress size={25} />
    </div>
  );
};

export default PageLoading;
