const express = require("express");
const router = express.Router();

// import controllers
const { 
	getPaymentBatch,
	getPayments,
	updatePendingPaymentBatch
} = require("../controllers/payment_batch");
const { uploadFile } = require("../controllers/upload_file");

// import middlewares

// api routes
router.get("/payment_batch", getPaymentBatch);
router.get("/payment_batch/:id", getPayments);
router.put("/payment_batch/:id/:pending_status", updatePendingPaymentBatch);
router.post("/upload_file", uploadFile);

module.exports = router;