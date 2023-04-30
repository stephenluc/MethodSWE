const multer = require('multer');
const PaymentBatch = require('../models/PaymentBatch');
const {
	Address,
	Employee,
	Payor,
	Payee,
	Payment
} = require('../models/Payment');
const fs = require('fs');
const xml2js = require('xml2js');
const { validatePayment } = require('../middlewares/validate_payment');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'xml_files')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({storage}).single('file');

function buildAddress(address) {
	const line1 = address.Line1[0];
	const city = address.City[0];
	const state = address.State[0];
	const zip = address.Zip[0];

	return new Address({
		line1,
		city,
		state,
		zip
	})
}

function buildPayor(payor) {
	const dunkinId = payor.DunkinId[0];
	const ABARouting = payor.ABARouting[0];
	const accountNumber = payor.AccountNumber[0];
	const name = payor.Name[0];
	const DBA = payor.DBA[0];
	const EIN = payor.EIN[0];
	const address = payor.Address[0];

	const payorRecord = new Payor({
		dunkinId,
	    ABARouting,
	    accountNumber,
	    name,
	    DBA,
	    EIN
	});
	payorRecord.address = buildAddress(address);
	return payorRecord
}

function buildPayee(payee) {
	const plaidId = payee.PlaidId[0];
	const loanAccountNumber = payee.LoanAccountNumber[0];

	return new Payee({
		plaidId,
	    loanAccountNumber
	})
}

function buildEmployee(employee) {
	const dunkinId = employee.DunkinId[0];
	const dunkinBranch = employee.DunkinBranch[0];
	const firstName = employee.FirstName[0];
	const lastName = employee.LastName[0];
	const DOB = employee.DOB[0];
	const phoneNumber = employee.PhoneNumber[0];

	return new Employee({
		dunkinId,
	    dunkinBranch,
	    firstName,
	    lastName,
	    DOB,
	    phoneNumber
	})
}

function buildPayment(paymentBatchId, payment) {
	const employee = payment.Employee[0];
	const payor = payment.Payor[0];
	const payee = payment.Payee[0];
	const amount = payment.Amount[0];
	const amountNum = parseFloat(amount.substring(1)).toFixed(2);

	const paymentRecord = new Payment({
		paymentBatchId,
		status: "pending",
		amount: amountNum
	});

	paymentRecord.employee = buildEmployee(employee);
	paymentRecord.payee = buildPayee(payee);
	paymentRecord.payor = buildPayor(payor);

	return paymentRecord;
}

async function parseFromFile(req, res) {
	const filePath = req.file.path;
    // Read the file
	fs.readFile(filePath, (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		// Parse the XML data
		xml2js.parseString(data, (err, result) => {
			if (err) {
			  console.error(err);
			  return;
			}
			try {
				// initialize a paymentBatch Record
				const paymentBatchRecord = new PaymentBatch({
					fileName: req.file.originalname,
					status: "pending"
				});

				const payments = [];
				let totalFunds = 0;
				const fundsPerBranch = new Map();
				const fundsPerSource = new Map();
				let numOfPayments = 0;
				let numOfInvalidRecords = 0;

				// iterate through all the rows in the xml file, ignore malformed rows
				result.root.row.forEach((payment) => {
					if (validatePayment(payment)) {
						const paymentRecord = buildPayment(paymentBatchRecord._id, payment);
						payments.push(paymentRecord);
						const amount = paymentRecord.amount;

						// estimate funds per branch
						const dunkinBranch = paymentRecord.employee.dunkinBranch;
						const fundAtBranch = fundsPerBranch.get(dunkinBranch) || 0;
						fundsPerBranch.set(dunkinBranch, fundAtBranch + amount);

						// estimate funds per source
						const sourceId = paymentRecord.payor.dunkinId;
						const fundAtSource = fundsPerSource.get(sourceId) || 0;
						fundsPerSource.set(sourceId, fundAtSource + amount);

						// total amount of funds giving out
						totalFunds += amount;
						numOfPayments++;
					} else {
						numOfInvalidRecords++;
					}					
				});

				paymentBatchRecord.totalFunds = totalFunds;
				paymentBatchRecord.fundsPerBranch = fundsPerBranch;
				paymentBatchRecord.fundsPerSource = fundsPerSource;
				paymentBatchRecord.numOfPayments = numOfPayments;

				// create a db entry
				Payment.insertMany(payments);
   				paymentBatchRecord.save();
   				return res.status(200).send(paymentBatchRecord);
   			} catch (e) {
   				console.log(e)
   			}
		});
	});
	return res.status(500)
}

exports.uploadFile = async (req, res) => {
	upload(req, res, (err) => {
        if (err) {
        	console.log(err);
            return res.status(500).json(err)
        }
        return parseFromFile(req, res);
    })
};