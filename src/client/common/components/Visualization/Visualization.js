import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { transformData } from "./Transformers/countComplaintsByIntakeSource";

export function Visualization(props) {
  const [data, setData] = useState({ data: {}, isFetching: false });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setData({ data: data.data, isFetching: true });
        const response = await axios.get(
          `/api/data?queryType=${props.queryType}`
        );
        const transformedData = transformData(response.data);
        setData({ data: transformedData, isFetching: false });
      } catch (e) {
        console.log(e);
        setData({ data: data.data, isFetching: false });
      }
    };
    fetchData();
  }, []);
  return (
    <Plot
      data={data.data}
      layout={{ width: 320, height: 240, title: "A Fancy Plot" }}
    />
  );
}
