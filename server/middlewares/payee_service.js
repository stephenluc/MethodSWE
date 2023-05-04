const Method = require('./method_services');
const Payee = require('../models/PayeeModel');
const individualService = require('./individual_service');
const merchantService = require('./merchant_service');

const { promisify } = require('util');
const sleep = promisify(setTimeout);

const cache = new Map();

async function getPayee(holderId, merchantId, loanAccountNumber) {
    return await Payee.findOne({
        holderId,
        merchantId,
        loanAccountNumber
    })
}

async function createPayee(accId, holderId, merchantId, loanAccountNumber) {
    const payee = new Payee({
        accId,
        holderId,
        merchantId,
        loanAccountNumber
    });
    await payee.save();
    cache.set({holderId, merchantId, loanAccountNumber}, payee);
    return payee;
}

async function fetchPayee(employee, payee) {
    const individual = await individualService.fetchIndividual(employee);
    const merchant = await merchantService.fetchMerchant(payee.PlaidId);

    const holderId = individual.entId;
    const merchantId = merchant.mchId;
    const loanAccountNumber = payee.LoanAccountNumber;
    const cacheKey = {holderId, merchantId, loanAccountNumber};
    const payeeAcc = await getPayee(holderId, merchantId, loanAccountNumber);
    try {
        if (!payeeAcc) {
            if (!cache.has(cacheKey)) {
                cache.set(holderId, false);
            } else {
                while(cache.has(cacheKey)){
                    await sleep(1500);
                    if (cache.get(cacheKey) !== false){
                        return cache.get(cacheKey);
                    }
                }
            }
            const methodPayeeAccount = await Method.createPayeeAccount({
                holder_id: holderId,
                liability: {
                    mch_id: merchantId,
                    account_number: loanAccountNumber
                }
            });
            return await createPayee(methodPayeeAccount.id, holderId, merchantId, loanAccountNumber);
        }
    } catch (err) {
        console.error(`Error in payee fetch ${err}`)
        cache.delete(cacheKey);
    }
    return payeeAcc;
}

module.exports = { fetchPayee }