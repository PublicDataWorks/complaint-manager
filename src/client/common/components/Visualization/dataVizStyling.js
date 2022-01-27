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

export const generateYAxisRange = maximum => {
  return { range: [0, maximum] };
};
