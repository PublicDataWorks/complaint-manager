export const COLORS = [
  "#002171",
  "#5fad56",
  "#9d5d9b",
  "#ffd100",
  "#3D6094",
  "#578585",
  "#c3837d",
  "#e3a957"
];

export const TITLE_FONT = {
  family: "Open Sans",
  size: 30,
  color: "#555555"
};

export const LABEL_FONT = {
  family: "Open Sans",
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
