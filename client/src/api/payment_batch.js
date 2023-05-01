import axios from "axios";

export async function getPaymentBatches() {
    try {
		const res = await fetch(`payment_batch`);
		return await res.json();
	} catch (err) {
		console.log(err)
	}
};

export async function getPaymentBatch(batchId) {
	try {
		const res = await fetch(`payment_batch/${batchId}`);
		return await res.json();
	} catch (err) {
		console.log(err)
	}
};

export async function updatePendingPaymentBatch(batchId, didAccept) {
	try {
		const isAccepted = didAccept ? 'accept' : 'reject';
		const res = await fetch(`payment_batch/${batchId}/${isAccepted}`, {
			method: "PUT",
		});
		return await res.json();
	} catch (err) {
		console.log(err)
	}
};
