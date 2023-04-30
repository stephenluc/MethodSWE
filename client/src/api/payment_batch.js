import axios from "axios";

export async function getPaymentBatches(setPaymentBatches) {
    try {
		const res = await fetch(`payment_batch`);
		const data = await res.json();
		setPaymentBatches(data);
	} catch (err) {
		console.log(err)
	}
};

export async function getPaymentBatch(batchId, setPayments) {
	try {
		const res = await fetch(`payment_batch/${batchId}`);
		const data = await res.json();
		setPayments(data);
	} catch (err) {
		console.log(err)
	}
};

export async function updatePendingPaymentBatch(batchId, didAccept, setStatus) {
	try {
		const isAccepted = didAccept ? 'accept' : 'reject';
		const res = await fetch(`payment_batch/${batchId}/${isAccepted}`, {
			method: "PUT",
		});
		const data = await res.json();
		setStatus(data.status);
	} catch (err) {
		console.log(err)
	}
};
