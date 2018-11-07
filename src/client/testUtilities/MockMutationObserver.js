function MockMutationObserver() {
  // https://github.com/tmpvar/jsdom/issues/639
  return {
    observe: function() {
      return [];
    },
    takeRecords: function() {
      return [];
    }
  };
}

function MockGetSelection() {
  return {
    addRange: function() {},
    removeAllRanges: function() {},
    getRangeAt: function() {}
  };
}

window.document.getSelection = MockGetSelection;

global.MutationObserver = MockMutationObserver;
