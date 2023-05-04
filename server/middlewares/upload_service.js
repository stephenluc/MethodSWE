 const PaymentBatch = require('../models/PaymentBatchModel');
const {
  Address,
  Employee,
  Payor,
  Payee,
  Payment
} = require('../models/PaymentModel');
const { validatePayment } = require('../middlewares/validate_service');
const { toCents, dollarToCents, toDollarNum, toList } = require('../middlewares/convertor_service');
const { createPayment } = require('../middlewares/payment_service');
const { fetchPayor } = require('../middlewares/payor_service');
const { fetchPayee } = require('../middlewares/payee_service');
const { fetchCorporation } = require('../middlewares/corporation_service');
const { fetchMerchant } = require('../middlewares/merchant_service');
const { fetchIndividual } = require('../middlewares/individual_service');
const { generateReport } = require('../middlewares/report_service');

async function buildPayment(batchId, payment) {
  try {
    const payor = await fetchPayor(payment.Payor);
    const payee = await fetchPayee(payment.Employee, payment.Payee);
    const amount = toCents(payment.Amount);

    const record = await createPayment(batchId, payor.accId, payee.accId, amount);
    return record;
  } catch (err) {
    console.error(`Error while building payment: ${err.message}`);
    return Promise.resolve(null);
  }
}

async function parseFromFile(data, fileName) {
  try {
    // initialize a paymentBatch Record
    const batchRecord = new PaymentBatch({
      fileName: fileName,
      status: "uploading"
    });
    batchRecord.save();
    const dataList = toList(data);

    // iterate through all the rows in the xml file, ignore malformed rows
    Promise.all(dataList.map(async (payment) => {
      if (validatePayment(payment)) {
        return await buildPayment(batchRecord._id, payment);
      }
    })).then(async (res) => {
      let count = 0;
      const totalAmount = res.reduce((acc, cur) => {
        if (cur === null) {
          return acc;
        }
        count++;
        return acc + cur.amount;
      }, 0);
      
      const sourceReport = await generateReport(batchRecord._id, "funds_per_source");
      const fundsPerSource = new Map();
      sourceReport.forEach((source) => {
          // funds per source
          const corpId = source.corpId;
          const totalAmount = toDollarNum(toCents(source.totalAmount));
          fundsPerSource.set(corpId, totalAmount);
      });

      const branchReport = await generateReport(batchRecord._id, "funds_per_branch");
      const fundsPerBranch = new Map();
      branchReport.forEach((branch) => {
          // funds per branch
          const branchId = branch.branchId;
          const totalAmount = toDollarNum(toCents(branch.totalAmount));
          fundsPerBranch.set(branchId, totalAmount);
      });

      await PaymentBatch.updateOne(
        { _id: batchRecord._id },
        { 
          status: 'pending',
          numOfPayments: count,
          fundsPerSource,
          fundsPerBranch,
          totalFunds: toDollarNum(totalAmount)
        });
      console.debug("All payments have been processed successfully.");
    }).catch((error) => {
      console.log(`Error processing payments: ${error}`);
    });

    return batchRecord;
  } catch (e) {
    console.error("error while parsing file:", e);
  }
}

module.exports = { parseFromFile }
