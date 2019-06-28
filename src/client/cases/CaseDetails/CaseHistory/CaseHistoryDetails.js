import React from "react";
import * as _ from "lodash";
import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";

const CaseHistoryDetails = ({ details, action, modelDescription }) => (
  <div>
    {modelDescription.length !== 0 ? (
      <div style={{ marginBottom: "8px" }}>
        {modelDescription.map((identifier, index) => {
          const keys = Object.keys(identifier);
          return (
            <div key={index}>
              <strong>{`${keys[0]}: ${identifier[keys[0]] || "N/A"}`}</strong>
            </div>
          );
        })}
      </div>
    ) : null}

    {renderDetails(details, action)}
  </div>
);

const renderDetails = (details, action) => {
  const longFieldLength = 50;

  if (action.includes(AUDIT_ACTION.DATA_UPDATED)) {
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

const renderStringDetails = details => (
  <div>{formatUploadDetails(details)}</div>
);

const formatUploadDetails = details => {
  return details.split("\n").map(i => {
    return <div>{i}</div>;
  });
};

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
