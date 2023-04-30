import axios from "axios";

export async function uploadFile(formData, onUploadResponse, updatePaymentBatches) {
	try {
		const res = await fetch(`upload_file`, {
			method: "POST",
			body: formData
		});
        onUploadResponse(res.ok ? "success" : "error");
		const data = await res.json();
		updatePaymentBatches(data);
		return data;
	} catch (err) {
		console.log("error", err)
		onUploadResponse("error")
	}
};

