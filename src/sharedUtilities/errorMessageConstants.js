const ROUTES = {
  "/export/job/:jobId": {},
  "/export/schedule/:operation": {},
  "/cases/:caseId": {
    get:
      "Something went wrong and the case details were not loaded. Please try again.",
    put:
      "Something went wrong and the case details were not edited. Please try again.",
    delete:
      "Something went wrong and the case was not archived. Please try again."
  },
  "/cases/:caseId/minimum-case-details": {
    get:
      "Something went wrong and the case details could not be loaded. Please try again."
  },
  "/cases": {
    post: "Something went wrong and the case was not created. Please try again."
  },
  "/cases/:caseId/case-notes": {
    get:
      "Something went wrong and the case notes were not loaded. Please try again.",
    post:
      "Something went wrong and the case note was not created. Please try again."
  },
  "/cases/:caseId/case-notes/:caseNoteId": {
    put:
      "Something went wrong and the case note was not edited. Please try again.",
    delete:
      "Something went wrong and the case note was not deleted. Please try again."
  },
  "/cases/:caseId/case-history": {
    get:
      "Something went wrong and the case history was not loaded. Please try again."
  },
  "/cases/:caseId/status": {
    put:
      "Something went wrong and the case status was not updated. Please try again."
  },
  "/cases/:caseId/narrative": {
    put:
      "Something went wrong and the case narrative was not updated. Please try again."
  }
};

export default ROUTES;
