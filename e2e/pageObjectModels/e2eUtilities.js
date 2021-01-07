module.exports.rerenderWait = 3000;
module.exports.roundtripWait = 25000;
module.exports.pause = 1000;
module.exports.dataLoadWait = 1000;
module.exports.animationPause = 1000;

module.exports.waitMoveAndClick = (context, cssSelector) => {
  return context
    .waitForElementPresent(cssSelector, this.rerenderWait)
    .waitForElementVisible(cssSelector, this.rerenderWait)
    .moveToElement(cssSelector, undefined, undefined)
    .click(cssSelector);
};
