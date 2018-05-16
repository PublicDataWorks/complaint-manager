const uploadAttachment = require("./handlers/cases/attachments/uploadAttachment");
const downloadAttachment = require("./handlers/cases/attachments/downloadAttachment");
const deleteAttachment = require("./handlers/cases/attachments/deleteAttachment");
const express = require("express");
const router = express.Router({ mergeParams: true });

router.post("/", uploadAttachment);
router.get("/:fileName", downloadAttachment);
router.delete("/:fileName", deleteAttachment);

module.exports = router;
