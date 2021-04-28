const formatTags = tagNames =>
  Array.isArray(tagNames) ? tagNames.join(", ") : "";
export default formatTags;
