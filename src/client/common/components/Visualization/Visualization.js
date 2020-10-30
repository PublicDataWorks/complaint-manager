import React from "react";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { PlotlyWrapper } from "./PlotlyWrapper";
import { getVisualizationData } from "./getVisualizationData";
import { getAggregateVisualizationLayout } from "./getAggregateVisualizationLayout";

const Visualization = props => {
  const [data, setData] = useState({ data: [], isFetching: true });
  const [layout, setLayout] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await getVisualizationData(
          props.queryType,
          props.queryOptions
        );
        const newLayout =
          getAggregateVisualizationLayout({
            queryType: props.queryType,
            isPublic: props.isPublic,
            newData
          }) || {};

        setData({ data: newData.data, isFetching: false });
        setLayout(newLayout);
      } catch (error) {
        console.error(error);
        setData({ data: {}, isFetching: false });
      }
    };

    fetchData();
  }, []);

  return (
    <PlotlyWrapper data={isEmpty(data.data) ? [] : data.data} layout={layout} />
  );
};

export default Visualization;
