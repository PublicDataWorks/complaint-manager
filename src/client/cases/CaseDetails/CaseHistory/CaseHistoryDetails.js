import React from "react";
import * as _ from "lodash";

const CaseHistoryDetails = ({ details, action, modelDescription }) => (
  <div>
    {modelDescription ? (
      <div>
        <strong>{modelDescription}</strong>
      </div>
    ) : null}

    {renderDetails(details, action)}
  </div>
);

const renderDetails = (details, action) => {
  const longFieldLength = 50;

  if (action.includes("updated")) {
    return Object.keys(details).map((field, index) => {
      if (
        details[field]["previous"].length > longFieldLength ||
        details[field]["new"].length > longFieldLength
      ) {
        return renderLongHistoryDetails(field, details, index);
      }
      return renderShortHistoryDetails(field, details, index);
    });
  }

  if (_.isString(details)) return renderStringDetails(details);

  return Object.keys(details).map((field, index) => {
    return renderSingleValueDetails(field, details, index);
  });
};

const renderStringDetails = details => <div>{details}</div>;

const renderSingleValueDetails = (field, details, index) => {
  const value =
    details[field]["previous"] === " "
      ? details[field]["new"]
      : details[field]["previous"];
  return (
    <div key={index}>
      {field}: '{value}'
    </div>
  );
};

const renderLongHistoryDetails = (field, details, index) => {
  return (
    <div key={index}>
      <div>{field} changed</div>
      <div style={{ paddingLeft: "16px" }}>
        <strong>from</strong> '{details[field]["previous"]}'
      </div>
      <div style={{ paddingLeft: "16px" }}>
        <strong>to</strong> '{details[field]["new"]}'
      </div>
    </div>
  );
};

const renderShortHistoryDetails = (field, details, index) => {
  return (
    <div key={index}>
      {field} changed <strong>from</strong> '{details[field]["previous"]}'{" "}
      <strong>to</strong> '{details[field]["new"]}'
    </div>
  );
};

export default CaseHistoryDetails;
