export async function uploadFile(formData, onUploadResponse) {
	try {
		const res = await fetch(`upload_file`, {
			method: "POST",
			body: formData
		});
		return await res;
	} catch (err) {
		console.log("error", err)
		onUploadResponse("error")
	}
};

