const Payment = require('../models/PaymentModel');
const { ObjectId } = require('mongodb');
const { toDollarStr } = require('../middlewares/convertor_service');
const { updatePaymentsStatus } = require('../middlewares/payment_service');

async function generateFundsPerSource(batchId) {
  const payments = await Payment.aggregate([
    {
      $match: { batchId: new ObjectId(batchId) },
    },
    {
      $lookup: {
        from: "payors",
        localField: "source",
        foreignField: "accId",
        as: "payor",
      },
    },
    {
      $lookup: {
        from: "corporations",
        localField: "payor.holderId",
        foreignField: "entId",
        as: "corporation",
      },
    },
    {
      $project: {
        totalAmount: { $sum: "$amount" },
        corpId: { $arrayElemAt: [ "$corporation.corpId", 0 ] },
        _id: 0,
      },
    },
  ]);
  const response = payments.map((payment) => {
      return {
          corpId: payment.corpId,
          totalAmount: toDollarStr(payment.totalAmount),
      };
  });
  return response;
}

async function generateFundsPerBranch(batchId) {
  const payments = await Payment.aggregate([
    {
      $match: { batchId: new ObjectId(batchId) },
    },
    {
      $lookup: {
        from: "payees",
        localField: "destination",
        foreignField: "accId",
        as: "payee",
      },
    },
    {
      $lookup: {
        from: "individuals",
        localField: "payee.holderId",
        foreignField: "entId",
        as: "individual",
      },
    },
    {
      $project: {
        totalAmount: { $sum: "$amount" },
        branchId: { $arrayElemAt: [ "$individual.branchId", 0 ] },
        _id: 0,
      },
    },
  ]);
  const response = payments.map((payment) => {
      return {
          branchId: payment.branchId,
          totalAmount: toDollarStr(payment.totalAmount),
      };
  });
  return response;
}

async function generateAllPayments(batchId) {
  await updatePaymentsStatus(batchId);
  const payments = await Payment.aggregate([
    {
      $match: { batchId: new ObjectId(batchId) },
    },
    {
      $lookup: {
        from: "payors",
        localField: "source",
        foreignField: "accId",
        as: "payor",
      },
    },
    {
      $lookup: {
        from: "corporations",
        localField: "payor.holderId",
        foreignField: "entId",
        as: "corporation",
      },
    },
    {
      $lookup: {
        from: "payees",
        localField: "destination",
        foreignField: "accId",
        as: "payee",
      },
    },
    {
      $lookup: {
        from: "individuals",
        localField: "payee.holderId",
        foreignField: "entId",
        as: "individual",
      },
    },
    {
      $project: {
        amount: "$amount",
        status: "$status",
        paymentId: "$paymentId",
        destination: {
          $first: "$payee"
        },
        corporation: {
          $first: "$corporation"
        },
        source: {
          $first: "$payor"
        },
        individual: {
          $first: "$individual"
        },
        _id: 0,
      },
    },
  ]);
  const response = payments.map((payment) => {
    return {
      paymentId: payment.paymentId,
      status: payment.status,
      amount: toDollarStr(payment.amount),
      "source.corpId": payment.corporation.corpId,
      "source.name": payment.corporation.corporation.name,
      "source.dba": payment.corporation.corporation.dba,
      "source.ein": payment.corporation.corporation.ein,
      "source.address.line1": payment.corporation.address.line1,
      "source.address.city": payment.corporation.address.city,
      "source.address.state": payment.corporation.address.state,
      "source.address.zip": payment.corporation.address.zip,
      "source.routingNumber": payment.source.routingNumber,
      "source.accountNumber": payment.source.accountNumber,
      "destination.dunkinId": payment.individual.dunkinId,
      "destination.firstName": payment.individual.individual.firstName,
      "destination.lastName": payment.individual.individual.lastName,
      "destination.phone": payment.individual.individual.phone,
      "destination.dob": payment.individual.individual.dob,
      "destination.branchId": payment.individual.branchId,
      "destination.merchantId": payment.destination.merchantId,
      "destination.loanAccountNumber": payment.destination.loanAccountNumber,
    };
  });
  return response;
}

async function generateReport(batchId, report_name) {
    let response = {};
    switch (report_name) {
        case 'funds_per_source':
            response = await generateFundsPerSource(batchId);
            break;
        case 'funds_per_branch':
            response = await generateFundsPerBranch(batchId);
            break;
        case 'all_payments':
            response = await generateAllPayments(batchId);
            break;
    }
    return response;
}

module.exports = { generateReport }