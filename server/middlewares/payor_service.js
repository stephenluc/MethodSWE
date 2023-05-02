const Method = require('./method_services');
const corporationService = require('./corporation_service');
const Payor = require('../models/PayorModel');

async function getPayor(holderId, routingNumber, accountNumber) {
    return await Payor.findOne({
        holderId,
        routingNumber,
        accountNumber
    });
}

async function createPayor(entId, holderId, routingNumber, accountNumber) {
    const payor = new Payor({
        entId,
        holderId,
        routingNumber,
        accountNumber
    });
    payor.save();
    return payor;
}

async function fetchPayor(payor) {
    const corpEntity = await corporationService.fetchCorporation(payor);
    const routingNumber = payor.ABARouting;
    const accountNumber = payor.AccountNumber;

    const payorAcc = await getPayor(corpEntity.entId, routingNumber, accountNumber);
    if (!payorAcc) {
        const methodPayorAccount = await Method.createCheckingAccount({
            holder_id: corpEntity.entId,
            ach: {
                routing: routingNumber,
                number: accountNumber,
                type: 'checking',
            },
        });
        return createPayor(methodPayorAccount.id, corpEntity.entId, routingNumber, accountNumber);
    }
    return payorAcc;
}

module.exports = { fetchPayor }