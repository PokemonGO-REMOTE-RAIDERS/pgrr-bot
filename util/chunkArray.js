module.exports = function chunkArray(array, size) {

	const result = [];
	const arrayCopy = [...array];
	while (arrayCopy.length > 0) {
		result.push(arrayCopy.splice(0, size));
	}

	return result;

};