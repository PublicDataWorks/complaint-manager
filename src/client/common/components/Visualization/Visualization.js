import { useEffect, useState } from "react";
import React from "react";
import { PlotlyWrapper } from "./PlotlyWrapper";
import { getVisualizationData } from "./getVisualizationData";
import _ from "lodash";

const Visualization = props => {
  const [data, setData] = useState({ data: {}, isFetching: false });
  const [layout, setLayout] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        setData({ data: data.data, isFetching: true });
        const transformedData = await getVisualizationData(
          props.queryType,
          props.isPublic
        );
        setData({ data: transformedData.data, isFetching: false });
        setLayout(transformedData.layout);
      } catch (e) {
        console.log(e);
        setData({ data: data.data, isFetching: false });
      }
    };
    fetchData();
  }, []);

  return (
    <PlotlyWrapper
      data={_.isEmpty(data.data) ? [] : data.data}
      layout={layout}
    />
  );
};

export default Visualization;
