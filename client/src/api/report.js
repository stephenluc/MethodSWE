export async function getReport(batchId, reportName) {
	try {
		const res = await fetch(`http://localhost:8080/report/${batchId}/${reportName}`);
		return await res.json();
	} catch (err) {
		console.log(err)
	}
};