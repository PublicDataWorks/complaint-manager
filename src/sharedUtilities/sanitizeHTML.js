import sanitizeHtml from "sanitize-html";

export const sanitize = input =>
  sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "escape"
  });

export const discardTags = input =>
  sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "discard"
  });
