const Method = require('./method_services');
const Payee = require('../models/PayeeModel');
const individualService = require('./individual_service');
const merchantService = require('./merchant_service');

async function getPayee(holderId, merchantId, loanAccountNumber) {
    return await Payee.findOne({
        holderId,
        merchantId,
        loanAccountNumber
    })
}

async function createPayee(entId, holderId, merchantId, loanAccountNumber) {
    const payee = new Payee({
        entId,
        holderId,
        merchantId,
        loanAccountNumber
    });
    payee.save();
    return payee;
}

async function fetchPayee(employee, payee) {
    const individual = await individualService.fetchIndividual(employee);
    const merchant = await merchantService.fetchMerchant(payee.PlaidId);

    const loanAccountNumber = payee.LoanAccountNumber;
    const payeeAcc = await getPayee(individual.entId, merchant.mchId, loanAccountNumber);

    if (!payeeAcc) {
        const methodPayeeAccount = await Method.createPayeeAccount({
            holder_id: individual.entId,
            liability: {
                mch_id: merchant.mchId,
                account_number: loanAccountNumber
            }
        });
        return await createPayee(methodPayeeAccount.id, individual.entId, merchant.mchId, loanAccountNumber);
    }

    return payeeAcc;
}

module.exports = { fetchPayee }