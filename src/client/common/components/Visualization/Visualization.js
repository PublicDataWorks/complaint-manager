import React from "react";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { PlotlyWrapper } from "./PlotlyWrapper";
import { getVisualizationData } from "./getVisualizationData";
import { getAggregateVisualizationLayout } from "./getAggregateVisualizationLayout";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const Visualization = props => {
  const [data, setData] = useState({ data: [], isFetching: true });
  const [layout, setLayout] = useState({});
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await getVisualizationData({
          queryType: props.queryType,
          isPublic: props.isPublic,
          queryOptions: props.queryOptions
        });
        const newLayout =
          getAggregateVisualizationLayout({
            queryType: props.queryType,
            queryOptions: props.queryOptions,
            isPublic: props.isPublic,
            isMobile: isMobile,
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
  }, [isMobile]);

  return (
    <PlotlyWrapper data={isEmpty(data.data) ? [] : data.data} layout={layout} />
  );
};

export default Visualization;
