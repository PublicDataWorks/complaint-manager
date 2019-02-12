"use strict";

module.exports = {
  up: async () => {
    return console.log("DONT RUN THE SECOND TIME");
  },
  down: async () => {
    return console.log("GOING BACK");
  }
};
