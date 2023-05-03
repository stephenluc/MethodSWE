export async function getPaymentBatches() {
    try {
		const res = await fetch(`http://localhost:8080/payment_batch`);
		const data = res.json();
		return data;
	} catch (err) {
		console.log(err)
	}
};

export async function updatePendingPaymentBatch(batchId, didAccept) {
	try {
		const isAccepted = didAccept ? 'accept' : 'reject';
		const res = await fetch(`http://localhost:8080/payment_batch/${batchId}/${isAccepted}`, {
			method: "PUT",
		});
		return res;
	} catch (err) {
		console.log(err)
	}
};
