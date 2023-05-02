const express = require("express");
const router = express.Router();

// import controllers
const paymentBatch = require("../controllers/payment_batch");
const uploadFile = require("../controllers/upload_file");

// api routes
router.use("/payment_batch", paymentBatch);
router.use("/upload_file", uploadFile);

module.exports = router;