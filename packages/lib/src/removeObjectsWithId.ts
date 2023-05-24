export function removeObjectsWithId(out: Array<any>, ids: Array<any>) {
	ids.forEach(i => {
		const objWithIdIndex = out.findIndex((obj) => obj.id === i.id);
		if (objWithIdIndex > -1) {
			out.splice(objWithIdIndex, 1);
		}
	})

	return out;
};