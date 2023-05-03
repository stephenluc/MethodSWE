const Method = require('./method_services');
const Individual = require('../models/IndividualModel');

const HARD_CODE_PHONE_NUMBER = '+15121231111'; // per instructions

function formatDate(date) {
    const dateSplit = date.split('-');
    return `${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`;
}

async function getIndividual(dunkinId) {
    return await Individual.findOne({ dunkinId });
}

async function createIndividual(methodIndividual, dunkinId, branchId) {
    const {
        id,
        individual
    } = methodIndividual;
    const individualMap = {
        firstName: individual.first_name,
        lastName: individual.last_name,
        phoneNumber: individual.phone,
        dob: individual.dob,
    };
    const ind = new Individual({
        entId: id,
        individual: individualMap,
        dunkinId,
        branchId
    });
    ind.save();
    return ind;
}

async function fetchIndividual(employee) {
    const dunkinId = employee.DunkinId;
    const individual = await getIndividual(dunkinId);
    if (!individual) {
        const methodIndividual = await Method.createIndividual({
            type: 'individual',
            individual: {
                first_name: employee.FirstName,
                last_name: employee.LastName,
                phone: HARD_CODE_PHONE_NUMBER,
                dob: formatDate(employee.DOB)
            }
        });
        return await createIndividual(methodIndividual, dunkinId, employee.DunkinBranch);
    }
    return individual;
}

module.exports = { fetchIndividual }