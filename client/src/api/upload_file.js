export async function uploadFile(formData) {
	const res = await fetch(`upload_file`, {
		method: "POST",
		body: formData
	});
	return res;
};

