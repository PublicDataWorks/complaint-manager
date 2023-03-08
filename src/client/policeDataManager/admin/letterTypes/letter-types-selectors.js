import { createSelector } from "reselect";
import { formValueSelector } from "redux-form";

const FIRST_PAGE_HEADER_DIV = '<div id="pageHeader-first"';
const SUBSEQUENT_PAGE_HEADER_DIV = '<div id="pageHeader"';
const PAGE_FOOTER_DIV = '<div id="pageFooter"';

export const getTemplateHead = createSelector(
  state => state.ui.editLetterType.template?.replaceAll("\n", ""),
  template => {
    let match = template?.match(/<head>(.*)<\/head>/i);
    return match
      ? match[1]
      : `<style>* {
                font-size: 8.5pt;
            }

            p {
                margin: 0;
            }

            .preserve-white-space {
                white-space: pre-wrap;
            }

            .ql-align-center {
                text-align: center;
            }</style>`;
  }
);

const getTemplateBody = createSelector(
  state => state.ui.editLetterType.template?.replaceAll("\n", ""),
  template => {
    let match = template?.match(/<body>(.*)<\/body>/i);
    return match ? match[1] : undefined;
  }
);

const findCorrespondingClosingTag = (html, tagName, endTagIndex) => {
  let closeIndex, nextSameTag;
  let startForNextTagSearch = endTagIndex;
  let startForCloseTagSearch = endTagIndex;
  do {
    closeIndex = html.indexOf(`</${tagName}>`, startForCloseTagSearch);
    nextSameTag = html.indexOf(`<${tagName}`, startForNextTagSearch);
    startForNextTagSearch = nextSameTag + `<${tagName}>`.length;
    startForCloseTagSearch = closeIndex + `</${tagName}>`.length;
  } while (closeIndex > nextSameTag && nextSameTag !== -1);
  return closeIndex;
};

export const getFirstPageHeader = createSelector(getTemplateBody, body => {
  let index = body?.indexOf(FIRST_PAGE_HEADER_DIV);
  if (!body || index === -1) {
    return undefined;
  }

  let endTagIndex = body.indexOf(">", index);
  let closeDivIndex = findCorrespondingClosingTag(body, "div", endTagIndex);
  return body.substring(endTagIndex + 1, closeDivIndex).trim();
});

export const getSubsequentPageHeader = createSelector(getTemplateBody, body => {
  let index = body?.indexOf(SUBSEQUENT_PAGE_HEADER_DIV);
  if (!body || index === -1) {
    return undefined;
  }

  let endTagIndex = body.indexOf(">", index);
  let closeDivIndex = findCorrespondingClosingTag(body, "div", endTagIndex);
  return body.substring(endTagIndex + 1, closeDivIndex).trim();
});

export const getFooterImage = createSelector(getTemplateBody, body => {
  let index = body?.match(
    /<span\s+style="display:inline-block; margin:\s+6px\s+16px\s+0\s+0"/i
  )?.index;
  if (!body || !index || index === -1) {
    return undefined;
  }

  let endTagIndex = body.indexOf(">", index);
  let closeSpanIndex = findCorrespondingClosingTag(body, "span", endTagIndex);
  return body.substring(endTagIndex + 1, closeSpanIndex).trim();
});

export const getFooterText = createSelector(getTemplateBody, body => {
  let index = body?.match(
    /<span\s+style="display:inline-block;\s+font-size:7pt;\s+color:\s+#7F7F7F;"/i
  ).index;
  if (!body || index === -1) {
    return undefined;
  }

  let endTagIndex = body.indexOf(">", index);
  let closeSpanIndex = findCorrespondingClosingTag(body, "span", endTagIndex);
  return body
    .substring(endTagIndex + 1, closeSpanIndex)
    .trim()
    .replaceAll(/\s{2,}/gi, " ");
});

const removeSectionFromContents = (contents, identifier, tagName) => {
  if (!contents) {
    return "";
  }

  let startIndex = contents.indexOf(identifier);
  if (startIndex < 0) {
    return contents;
  }

  let tagEndIndex = contents.indexOf(">", startIndex);
  let endIndex =
    findCorrespondingClosingTag(contents, tagName, tagEndIndex) +
    `</${tagName}>`.length;
  return contents.substring(0, startIndex) + contents.substring(endIndex);
};

export const getLetterContents = createSelector(getTemplateBody, body => {
  let letterContents = body;
  letterContents = removeSectionFromContents(
    letterContents,
    FIRST_PAGE_HEADER_DIV,
    "div"
  );

  letterContents = removeSectionFromContents(
    letterContents,
    SUBSEQUENT_PAGE_HEADER_DIV,
    "div"
  );

  letterContents = removeSectionFromContents(
    letterContents,
    PAGE_FOOTER_DIV,
    "div"
  );

  return letterContents.trim();
});

// documentation for headers and footer https://github.com/marcbachmann/node-html-pdf/blob/master/README.md#footers-and-headers
export const reassembleTemplate = createSelector(
  getTemplateHead,
  state => formValueSelector("letterTypeForm")(state, "firstPageHeader"),
  state => formValueSelector("letterTypeForm")(state, "subsequentPageHeader"),
  state => formValueSelector("letterTypeForm")(state, "footerImage"),
  state => formValueSelector("letterTypeForm")(state, "footerText"),
  state => formValueSelector("letterTypeForm")(state, "template"),
  (
    templateHead,
    firstPageHeader,
    subsequentPageHeader,
    footerImage,
    footerText,
    template
  ) => {
    return `
    <html>
      <head>
        ${templateHead}
      </head>
      <body>
        ${
          firstPageHeader
            ? `<div id="pageHeader-first">${firstPageHeader}</div>`
            : ""
        }
        ${
          subsequentPageHeader
            ? `<div id="pageHeader" style="font-size:8.5pt; color: #7F7F7F;">${subsequentPageHeader}</div>`
            : ""
        }
        ${
          footerImage || footerText
            ? `<div id="pageFooter" style="text-align: center; margin-top: 16px">
          ${
            footerImage
              ? `<span style="display:inline-block; margin: 6px 16px 0 0">${footerImage}</span>`
              : ""
          }
          ${
            footerText
              ? `<span style="display:inline-block; font-size:7pt; color: #7F7F7F;">${footerText}</span>`
              : ""
          }
          <span style="display:inline-block; width: 46px">&nbsp;</span>
        </div>`
            : ""
        }
        ${template ? template : ""}
      </body>
    </html>
  `;
  }
);
