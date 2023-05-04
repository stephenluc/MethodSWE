const Method = require('./method_services');
const corporationService = require('./corporation_service');
const Payor = require('../models/PayorModel');

const { promisify } = require('util');
const sleep = promisify(setTimeout);

const cache = new Map();

async function getPayor(holderId, routingNumber, accountNumber) {
    return await Payor.findOne({
        holderId,
        routingNumber,
        accountNumber
    });
}

async function createPayor(accId, holderId, routingNumber, accountNumber) {
    const payor = new Payor({
        accId,
        holderId,
        routingNumber,
        accountNumber
    });
    await payor.save();
    cache.set({holderId, routingNumber, accountNumber}, payor);
    return payor;
}

async function fetchPayor(payor) {
    const corpEntity = await corporationService.fetchCorporation(payor);
    const holderId = corpEntity.entId;
    const routingNumber = payor.ABARouting;
    const accountNumber = payor.AccountNumber;
    const cacheKey = {holderId, routingNumber, accountNumber};
    const payorAcc = await getPayor(holderId, routingNumber, accountNumber);
    try {
        if (!payorAcc) {
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
            const methodPayorAccount = await Method.createCheckingAccount({
                holder_id: holderId,
                ach: {
                    routing: routingNumber,
                    number: accountNumber,
                    type: 'checking',
                },
            });
            return createPayor(methodPayorAccount.id, holderId, routingNumber, accountNumber);
        }
    } catch (err) {
        console.error(`Error in payor fetch ${err}`)
        cache.delete(cacheKey);
    }
    return payorAcc;
}

module.exports = { fetchPayor }