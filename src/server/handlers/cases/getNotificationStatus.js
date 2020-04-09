const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../complaintManager/models/index");

const getNotificationStatus = asyncMiddleWare(
  async (request, response, next) => {
    let notificationStatus = {
      caseNoteExists: false,
      notificationExists: false
    };

    const getCaseNote = await models.case_note.findOne({
      where: { id: request.params.caseNoteId }
    });

    const getNotification = await models.notification.findOne({
      where: {
        id: request.params.notificationId,
        caseNoteId: request.params.caseNoteId
      }
    });

    if (getCaseNote) {
      notificationStatus.caseNoteExists = true;
      if (getNotification) {
        notificationStatus.notificationExists = true;
      }
    }

    response.send(notificationStatus);
  }
);

export default getNotificationStatus;
