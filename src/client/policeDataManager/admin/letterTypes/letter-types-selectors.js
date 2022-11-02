import { createSelector } from "reselect";
import { formValueSelector } from "redux-form";

export const getTemplateHead = createSelector(
  state => state.ui.editLetterType.template?.replaceAll("\n", ""),
  template => {
    let match = template?.match(/<head>(.*)<\/head>/i);
    return match ? match[1] : undefined;
  }
);

const getTemplateBody = createSelector(
  state => state.ui.editLetterType.template?.replaceAll("\n", ""),
  template => {
    let match = template?.match(/<body>(.*)<\/body>/i);
    return match ? match[1] : undefined;
  }
);

export const getFirstPageHeader = createSelector(getTemplateBody, body => {
  let index = body?.indexOf('<div id="pageHeader-first"');
  if (!body || index === -1) {
    return undefined;
  }

  let endTagIndex = body.indexOf(">", index);
  let closeDivIndex = body.indexOf("</div>", endTagIndex);
  return body.substring(endTagIndex + 1, closeDivIndex).trim();
});

export const getSubsequentPageHeader = createSelector(getTemplateBody, body => {
  let index = body?.indexOf('<div id="pageHeader"');
  if (!body || index === -1) {
    return undefined;
  }

  let endTagIndex = body.indexOf(">", index);
  let closeDivIndex = body.indexOf("</div>", endTagIndex);
  return body.substring(endTagIndex + 1, closeDivIndex).trim();
});

export const getFooterImage = createSelector(getTemplateBody, body => {
  let index = body?.match(
    /<span\s+style="display:inline-block; margin:\s+6px\s+16px\s+0\s+0"/i
  ).index;
  if (!body || index === -1) {
    return undefined;
  }

  let endTagIndex = body.indexOf(">", index);
  let closeSpanIndex = body.indexOf("</span>", endTagIndex);
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
  let closeSpanIndex = body.indexOf("</span>", endTagIndex);
  return body
    .substring(endTagIndex + 1, closeSpanIndex)
    .trim()
    .replaceAll(/\s{2,}/gi, " ");
});

export const getLetterContents = createSelector(getTemplateBody, body => {
  const closeDiv = "</div>";
  let index = body?.lastIndexOf(closeDiv);
  if (!body) {
    return undefined;
  } else if (index === -1) {
    return body.trim();
  } else {
    return body.substring(index + closeDiv.length).trim();
  }
});

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
            ? `<div id="pageHeader""font-size:8.5pt; color: #7F7F7F;">${subsequentPageHeader}</div>`
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
