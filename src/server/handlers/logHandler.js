import asyncMiddleware from "../handlers/asyncMiddleware";

const foregroundColors = {
  BLACK: 30,
  RED: 31,
  GREEN: 32,
  YELLOW: 33,
  BLUE: 34,
  MAGENTA: 35,
  CYAN: 36,
  WHITE: 37,
  BRIGHT_BLACK: 90,
  BRIGHT_RED: 91,
  BRIGHT_GREEN: 92,
  BRIGHT_YELLOW: 93,
  BRIGHT_BLUE: 94,
  BRIGHT_MAGENTA: 95,
  BRIGHT_CYAN: 96,
  BRIGHT_WHITE: 97
};

const backgroundColors = {
  BLACK: 40,
  RED: 41,
  GREEN: 42,
  YELLOW: 43,
  BLUE: 44,
  MAGENTA: 45,
  CYAN: 46,
  WHITE: 47,
  BRIGHT_BLACK: 100,
  BRIGHT_RED: 101,
  BRIGHT_GREEN: 102,
  BRIGHT_YELLOW: 103,
  BRIGHT_BLUE: 104,
  BRIGHT_MAGENTA: 105,
  BRIGHT_CYAN: 106,
  BRIGHT_WHITE: 107
};

const generateColor = (
  foregroundColor = foregroundColors.WHITE,
  backgroundColor = backgroundColors.BLACK
) => {
  return string => {
    return (
      "\x1b[" +
      foregroundColor +
      ";" +
      backgroundColor +
      "m" +
      string +
      "\x1b[0m"
    );
  };
};

const green = generateColor(foregroundColors.BRIGHT_GREEN);
const yellow = generateColor(foregroundColors.BRIGHT_YELLOW);
const magenta = generateColor(foregroundColors.BRIGHT_MAGENTA);
const cyan = generateColor(foregroundColors.BRIGHT_CYAN);

const transportFormat = ({ level, message, timestamp, label }) => {
  return `${magenta(timestamp)} [${yellow(label)}] ${green(level)}: ${cyan(
    message
  )}`;
};

const logHandler = asyncMiddleware(async (request, response, next) => {
  const { messages = [] } = request.body || {};
  messages.forEach(message => console.log(transportFormat(message)));
  response.status(200).end();
});

export default logHandler;
