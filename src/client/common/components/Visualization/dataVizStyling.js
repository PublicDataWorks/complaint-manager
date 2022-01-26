export const COLORS = [
  "#002171",
  "#5fad56",
  "#9d5d9b",
  "#f0e443",
  "#0072B2",
  "#E69F01",
  "#5B4C9C",
  "#117733",
  "#CD78A7",
  "#89CCEE",
  "#44AA99",
  "#DDDDDD"
];

export const TITLE_FONT = {
  family: '"Roboto", "Helvetica", "Arial", sans-serif',
  size: 30,
  color: "#555555"
};

export const LABEL_FONT = {
  family: '"Roboto", "Helvetica", "Arial", sans-serif',
  size: 12,
  color: "#777777"
};

export const PUBLIC_LABEL_FONT = {
  family: '"IBM Plex Sans Medium", "IBM Plex Sans", "Arial", sans-serif',
  size: 12,
  color: "#777777"
};

export const generateDonutCenterAnnotations = (count = 0) => {
  return [
    {
      font: {
        size: 40
      },
      showarrow: false,
      text: count,
      x: 0.5,
      y: 0.55
    },
    {
      font: {
        size: 20
      },
      showarrow: false,
      text: "Complaints",
      x: 0.5,
      y: 0.45
    }
  ];
};

export const generateNoTagsLayout = (numberOfXValues, numberOfYValues) => {
  const layout = {};

  if (numberOfXValues + numberOfYValues === 0) {
    layout.annotations = [
      {
        text: "No Tags to display",
        y: 1,
        showarrow: false,
        font: LABEL_FONT
      }
    ];

    layout.dragmode = false;

    layout.yaxis = {
      zeroline: false,
      showgrid: false,
      showticklabels: false
    };

    layout.xaxis = {
      zeroline: true,
      showgrid: false,
      showticklabels: false
    };
  }

  return layout;
};

export const generateNoDistrictsLayout = (numberOfXValues, numberOfYValues) => {
  const layout = {};

  if (numberOfXValues + numberOfYValues === 0) {
    layout.annotations = [
      {
        text: "No Complaints to display",
        y: 1,
        showarrow: false,
        font: LABEL_FONT
      }
    ];

    layout.dragmode = false;

    layout.yaxis = {
      zeroline: false,
      showgrid: false,
      showticklabels: false
    };

    layout.xaxis = {
      zeroline: true,
      showgrid: false,
      showticklabels: false
    };
  }

  return layout;
};

export const generateYAxisRange = maximum => {
  return { range: [0, maximum] };
};
