export function minioImage(image: string | undefined) {
	if (!image) return `http://joseantcordeiro.hopto.org:9000/uploads/50d0277bf68b5163.png`
	return `http://joseantcordeiro.hopto.org:9000/uploads/${image}`;
}