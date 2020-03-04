import React from "react";
import Plot from "react-plotly.js";

export function PlotlyWrapper(props) {
    return (
        <Plot
            {...props}
        />
    );
}