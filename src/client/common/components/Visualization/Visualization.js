import React from "react";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { PlotlyWrapper } from "./PlotlyWrapper";
import { getVisualizationData } from "./getVisualizationData";
import { getAggregateVisualizationLayout } from "./getAggregateVisualizationLayout";
import { getVisualizationConfig } from "./getVisualizationConfig";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const Visualization = ({ queryType, isPublic, queryOptions }) => {
  const [data, setData] = useState({ data: [], isFetching: true });
  const [layout, setLayout] = useState({});
  const [config, setConfig] = useState({});
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await getVisualizationData({
          queryType,
          isPublic,
          queryOptions
        });

        setData({ data: newData.data, isFetching: false });
      } catch (error) {
        console.error(error);
        setData({ data: {}, isFetching: false });
      }
    };

    fetchData();
  }, [queryType, isPublic, queryOptions]);
  
  useEffect(() => {
    const createConfig = () => {
      const config = { ...getVisualizationConfig(queryType) };
      setConfig({ ...config });
    }

    const createLayout = () => {
      const newLayout =
        getAggregateVisualizationLayout({
          newData: data,
          queryType,
          queryOptions,
          isPublic,
          isMobile
        }) || {};
      setLayout({ ...newLayout });
    };

    createLayout();
    createConfig();
  }, [data, queryType, queryOptions, isPublic, isMobile]);

  return (
      <PlotlyWrapper
         style={{ height: "100%", width: "100%" }}
         data={isEmpty(data.data) ? [] : data.data}
         layout={layout}
         config={config} />
  );
};

export default Visualization;
