export async function uploadFile(formData) {
	const res = await fetch(`http://localhost:8080/upload_file`, {
		method: "POST",
		body: formData
	});
	return res;
};

