const { Environments, Method } = require('method-node');
const throttler = require('./throttler_service');

// method api
const method = new Method({
  apiKey: process.env.METHOD_API_KEY,
  env: Environments.dev,
});

const createCheckingAccount = async (data) => {
    return await throttler.addRequest(async () => {
        return await method.accounts.create(data);
    });
};

const fetchMerchant = async (plaidId) => {
    return await throttler.addRequest(async () => {
        return await method.merchants.list({
            'provider_id.plaid': plaidId,
        });
    });
};

const createPayeeAccount = async (data) => {
    return await throttler.addRequest(async () => {
        return await method.accounts.create(data);
    });
};

const createIndividual = async (data) => {
    return await throttler.addRequest(async () => {
        return await method.entities.create(data);
    });
};

const createCorporation = async (data) => {
    return await throttler.addRequest(async () => {
        return await method.entities.create(data);
    });
};

const createPayment = async (data) => {
    return await throttler.addRequest(async () => {
        return await method.payments.create(data);
    });
};

const getPayment = async (id) => {
    return await throttler.addRequest(async () => {
        return await method.payments.get(id);
    });
};

module.exports = {
    createCorporation,
    createIndividual,
    createCheckingAccount,
    createPayeeAccount,
    createPayment,
    getPayment,
    fetchMerchant,
};