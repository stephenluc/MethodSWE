const express = require("express");
const router = express.Router();

// import controllers
const paymentBatch = require("../controllers/payment_batch");
const uploadFile = require("../controllers/upload_file");
const report = require("../controllers/report");

// api routes
router.use("/payment_batch", paymentBatch);
router.use("/upload_file", uploadFile);
router.use("/report", report);


module.exports = router;