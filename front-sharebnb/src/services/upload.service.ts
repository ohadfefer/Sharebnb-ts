export const uploadService = {
	uploadImg,
}

async function uploadImg(ev: React.ChangeEvent<HTMLInputElement>): Promise<any> {
	const CLOUD_NAME = 'devvappxu' 
	const UPLOAD_PRESET = 'Sharebnb-ts'
	const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

	const file =  ev.target.files?.[0]
	if (!file) return

	const formData = new FormData()
	formData.append('file', file)
	formData.append('upload_preset', UPLOAD_PRESET)
	
	try {
		const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })
		if (!res.ok) throw new Error(`Upload failed (${res.status} ${res.statusText})`)
		const imgData = await res.json()
		return imgData
	} catch (err) {
		console.error(err)
		throw err
	}
}