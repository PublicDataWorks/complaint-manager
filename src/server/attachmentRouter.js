const uploadAttachment = require("./handlers/cases/attachments/uploadAttachment");
const deleteAttachment = require("./handlers/cases/attachments/deleteAttachment");
const express = require("express");
const router = express.Router({ mergeParams: true });

router.post("/", uploadAttachment);
router.delete("/", deleteAttachment);

module.exports = router;
