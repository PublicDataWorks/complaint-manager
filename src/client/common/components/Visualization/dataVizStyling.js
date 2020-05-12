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

export const generateDonutCenterAnnotations = count => {
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
