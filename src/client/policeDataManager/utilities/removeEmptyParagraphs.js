/**
 * @param {*} html
 * @returns a string with empty paragraphs removed
 * Regex summary:
 * <p> matches the opening <p> tag.
 * \s+ matches one or more whitespace characters.
 * <\/p> matches the closing </p> tag.
 * The g flag at the end makes the regular expression global,
 * which means it will match all occurrences in the string, not just the first one.
 */
const removeEmptyParagraphs = html => {
  return html.replace(/<p>\s+<\/p>/g, "");
};

export default removeEmptyParagraphs;
