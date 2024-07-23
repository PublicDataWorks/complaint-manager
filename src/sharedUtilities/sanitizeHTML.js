import sanitizeHtml from "sanitize-html";

export const sanitize = input => {
  let sanitizedInput = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "escape"
  });

  sanitizedInput = sanitizedInput.replace(/&amp;/g, "&");

  return sanitizedInput;
};

export const discardTags = input =>
  sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "discard"
  });
