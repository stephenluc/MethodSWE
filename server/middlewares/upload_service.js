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

function compileBatchSummary(payments) {
  let totalFunds = 0;
  const fundsPerBranch = new Map();
  const fundsPerSource = new Map();
  let numOfPayments = 0;
  let numOfInvalidRecords = 0;

  payments.forEach((payment) => {
    if (validatePayment(payment)) {
      const amount = toCents(payment.Amount);

      // estimate funds per branch
      const dunkinBranch = payment.Employee.DunkinBranch;
      const fundAtBranch = dollarToCents(fundsPerBranch.get(dunkinBranch)) || 0;
      fundsPerBranch.set(dunkinBranch, toDollarNum(fundAtBranch + amount));

      // estimate funds per source
      const sourceId = payment.Payor.DunkinId;
      const fundAtSource = dollarToCents(fundsPerSource.get(sourceId)) || 0;
      fundsPerSource.set(sourceId, toDollarNum(fundAtSource + amount));

      // total amount of funds giving out
      totalFunds += amount;
      numOfPayments++;
    } else {
      numOfInvalidRecords++;
    } 
  });

  totalFunds = toDollarNum(totalFunds)
  return {
    totalFunds,
    fundsPerBranch,
    fundsPerSource,
    numOfPayments,
    numOfInvalidRecords
  };
}

async function buildPayment(batchId, payment) {
  const payor = await fetchPayor(payment.Payor);
  const payee = await fetchPayee(payment.Employee, payment.Payee);
  const amount = toCents(payment.Amount);

  const record = await createPayment(batchId, payor.entId, payee.entId, toDollarNum(amount));
  return record;
}

async function parseFromFile(data, fileName) {
  try {
    // initialize a paymentBatch Record
    const batchRecord = new PaymentBatch({
      fileName: fileName,
      status: "pending"
    });

    const dataList = toList(data);
    // iterate through all the rows in the xml file, ignore malformed rows
    dataList.forEach(async (payment) => {
      if (validatePayment(payment)) {
        await buildPayment(batchRecord._id, payment);
      }        
    });

    const {
      totalFunds,
      fundsPerBranch,
      fundsPerSource,
      numOfPayments,
      numOfInvalidRecords
    } = compileBatchSummary(dataList);

    batchRecord.totalFunds = totalFunds;
    batchRecord.fundsPerBranch = fundsPerBranch;
    batchRecord.fundsPerSource = fundsPerSource;
    batchRecord.numOfPayments = numOfPayments;
    batchRecord.save();
    return batchRecord;
  } catch (e) {
    console.log("error:", e);
  }
}

module.exports = {parseFromFile}
