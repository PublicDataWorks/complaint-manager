import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import * as countComplaintsByIntakeSource from "./Transformers/countComplaintsByIntakeSource";
import { QUERY_TYPES } from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { PlotlyWrapper } from "./PlotlyWrapper";

const Visualization = props => {
  const [data, setData] = useState({ data: {}, isFetching: false });
  const [layout, setLayout] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        setData({ data: data.data, isFetching: true });
        const response = await axios.get(
          `/api/data?queryType=${props.queryType}`
        );
        let transformedData;
        switch (props.queryType) {
          case QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE:
            transformedData = countComplaintsByIntakeSource.transformData(
              response.data
            );
            break;
          default:
            throw new Error(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED);
        }
        setData({ data: transformedData.data, isFetching: false });
        setLayout(transformedData.layout);
      } catch (e) {
        console.log(e);
        setData({ data: data.data, isFetching: false });
      }
    };
    fetchData();
  }, []);

  return <PlotlyWrapper data={[data.data]} layout={layout} />;
};

export default Visualization;
