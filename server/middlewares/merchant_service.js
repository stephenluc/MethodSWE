const Method = require('./method_services');
const Merchant = require('../models/MerchantModel');

async function getMerchant(plaidId) {
    return await Merchant.findOne({ plaidId })
}

async function createMerchant(mchId, plaidId) {
    const merchant = new Merchant({
        mchId,
        plaidId
    });
    merchant.save();
    return merchant;
}

async function fetchMerchant(plaidId) {
    const merchant = await getMerchant(plaidId);
    if (!merchant) {
        const methodMerchant = await Method.fetchMerchant(plaidId);
        return await createMerchant(methodMerchant[0].mch_id, plaidId);
    }
    return merchant;
}

module.exports = {fetchMerchant}