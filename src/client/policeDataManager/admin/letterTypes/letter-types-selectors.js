import { createSelector } from "reselect";

export const separateTemplateHeadFromBody = createSelector(
  state => state.ui.editLetterType.template?.replaceAll("\n", ""),
  template => {
    const match = template?.match(
      /<head>(.*)<\/head>\s*<body>\s*<div[^>]*>(.*)<\/div>\s*<div[^>]*>(.*)<\/div>\s*<div[^>]*>\s*<span[^>]*>(.*)<\/span>\s*<span[^>]*>(.*)<\/span>\s*<span.*\/span>\s*<\/div>(.*)<\/body>/i
    );
    return {
      head: match ? match[1] : undefined,
      firstPageHeader: match ? match[2] : undefined,
      subsequentPageHeader: match ? match[3] : undefined,
      footerImage: match ? match[4] : undefined,
      footerText: match ? match[5] : undefined,
      body: match ? match[6] : undefined
    };
  }
);
