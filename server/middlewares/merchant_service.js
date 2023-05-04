const Method = require('./method_services');
const Merchant = require('../models/MerchantModel');

const { promisify } = require('util');
const sleep = promisify(setTimeout);

const cache = new Map();

async function getMerchant(plaidId) {
    return await Merchant.findOne({ plaidId })
}

async function createMerchant(mchId, plaidId) {
    const merchant = new Merchant({
        mchId,
        plaidId
    });
    await merchant.save();
    cache.set(plaidId, merchant);
    return merchant;
}

async function fetchMerchant(plaidId) {
    const merchant = await getMerchant(plaidId);
    try {
        if (!merchant) {
            if (!cache.has(plaidId)) {
                cache.set(plaidId, false);
            } else {
                while(cache.has(plaidId)){
                    await sleep(1500);
                    if (cache.get(plaidId) !== false){
                        return cache.get(plaidId);
                    }
                }
            }
            const methodMerchant = await Method.fetchMerchant(plaidId);
            if (methodMerchant[0]) {
                return await createMerchant(methodMerchant[0].mch_id, plaidId);
            }
            // plaidId ins_116527 doesn't return a merchant
            console.error(`mchId doesn't exist for plaidId ${plaidId}`)
            cache.set(plaidId, "doesn't exist");
            return cache.get(plaidId);
        }
    } catch (err) {
        console.error(`Error in mechant fetch ${err}`)
        cache.delete(plaidId);
    }
    return merchant;
}

module.exports = {fetchMerchant}