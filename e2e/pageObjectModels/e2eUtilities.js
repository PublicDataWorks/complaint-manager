module.exports.rerenderWait = 6000;
module.exports.roundtripWait = 50000;
module.exports.pause = 4000;
module.exports.dataLoadWait = 5000;
module.exports.animationPause = 2000;

module.exports.waitMoveAndClick = (context, cssSelector) => {
  return context
    .waitForElementPresent(cssSelector, this.rerenderWait)
    .moveToElement(cssSelector, undefined, undefined)
    .click(cssSelector, this.logOnClick);
};

module.exports.logOnClick = result => {
  console.log(result.status == 0 ? `✔ Click successful` : `✖ Click failed`);
};
