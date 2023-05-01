const { Method, Environments } = require('method-node');

// method api
// const method = new Method({
//   apiKey: process.env.METHOD_API_KEY,
//   env: Environments.dev,
// });
// method.ping()
//  .then((res) => console.log("Method Api Connected", res))
//  .catch((err) => console.log("Method Api Connection Error", err));

exports.createIndividual = async (method, user) => {
  const {
    firstName,
    lastName,
    address
  } = user;

  const entity = await method.entities.create({
    type: 'individual',
    individual: {
      first_name: firstName,
      last_name: lastName,
      phone: '+15121231111',
    },
  })
    .then(res => console.log("Method create", res))
    .catch(err => console.log("method api error", err));
};

exports.createCorporation = async (method, corporation) => {
  const {
    name,
    DBS,
    EIN,
    address,
  } = corporation;

  const entity = await method.entities.create({
    type: 'c_corporation',
    corporation: {
      name: name,
      dba: DBS,
      ein: EIN,
      owners: [],
    },
    address,
  })
    .then(res => console.log("Method create", res))
    .catch(err => console.log("method api error", err));
};

exports.getEntity = async (method, entityId) => {
  return await method.entities.get(entityId);
};

exports.createAchAccount = async (method, entityId, account) => {
  const {
    ABARouting,
    accountNumber
  } = account

  return await method.accounts.create({
    holder_id: entityId,
    ach: {
      routing: ABARouting,
      number: accountNumber,
      type: 'checking',
    },
  });
};

exports.createPayment = async (method, source, destination, amount) => {
  const payment = await method.payments.create({
    amount,
    source,
    destination,
    description: 'Student Loan Pmt',
  });
}
