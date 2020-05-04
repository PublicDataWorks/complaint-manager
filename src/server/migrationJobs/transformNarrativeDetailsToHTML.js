import _ from "lodash";

export const transformNarrativeDetailsToHTML = async (cases, transaction) => {
  let plainTextNarrativeDetails = "";

  for (let i = 0; i < cases.length; i++) {
    if (!_.isEmpty(cases[i].narrativeDetails)) {
      try {
        plainTextNarrativeDetails = cases[i].narrativeDetails;
        await updateDatabaseWithHTMLNarrativeDetails(
          cases[i],
          plainTextNarrativeDetails,
          transaction
        );
      } catch (error) {
        throw new Error(
          `Error while transforming narrative details plain text to HTML for case with id ${cases[i].id}. \nError: ${error}`
        );
      }
    }
  }
};

const updateDatabaseWithHTMLNarrativeDetails = async (
  currentCase,
  plainTextNarrativeDetails,
  transaction
) => {
  const htmlNarrativeDetails = plainTextToHTML(plainTextNarrativeDetails);

  await currentCase.update(
    { narrativeDetails: htmlNarrativeDetails },
    { auditUser: "Katmai" }
  );
};

const plainTextToHTML = plainText => {
  let htmlText;

  // 1: Plain Text Search
  htmlText = plainText
    .replace(/&/g, "&amp;")
    .replace(/ /g, "&nbsp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/¢/g, "&cent;")
    .replace(/©/g, "&copy;")
    .replace(/®/g, "&reg;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2: Line Breaks
  htmlText = htmlText.replace(/\n/g, "<br>");

  // 3: Paragraphs
  htmlText = htmlText.replace(/<br>\s<br>/g, "</p><p>");

  // 4: Wrap in Paragraph Tags
  htmlText = "<p>" + htmlText + "</p>";

  return htmlText;
};

export const revertTransformNarrativeDetailsToHTML = async (
  cases,
  transaction
) => {
  let htmlNarrativeDetails = "";

  for (let i = 0; i < cases.length; i++) {
    if (!_.isEmpty(cases[i].narrativeDetails)) {
      htmlNarrativeDetails = cases[i].narrativeDetails;
      await updateDatabaseWithPlainTextNarrativeDetails(
        cases[i],
        htmlNarrativeDetails,
        transaction
      );
    }
  }
};

const updateDatabaseWithPlainTextNarrativeDetails = async (
  currentCase,
  htmlNarrativeDetails,
  transaction
) => {
  const plainTextNarrativeDetails = HTMLtoPlainText(htmlNarrativeDetails);

  await currentCase.update(
    { narrativeDetails: plainTextNarrativeDetails },
    { auditUser: "Katmai" }
  );
};

const HTMLtoPlainText = htmlText => {
  let plainText;

  // 1: HTML Search
  plainText = htmlText
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&cent;/g, "¢")
    .replace(/&copy;/g, "©")
    .replace(/&reg;/g, "®")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  // 3: Paragraphs
  plainText = plainText.replace(/<p>/g, "");
  plainText = plainText.replace(/<\/p>/g, "");

  // 2: Line Breaks
  plainText = plainText.replace(/<br>/g, "\n");

  return plainText;
};
