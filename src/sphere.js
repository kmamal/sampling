const { _sampleNormal } = require('./normal')

// Generates surface points

const sampleSphere = (n) => {
	const values = new Array(n)

	let sum
	do {
		sum = 0
		for (let i = 0; i < n; i++) {
			const x = _sampleNormal()
			values[i] = x
			sum += x * x
		}
	} while (sum === 0)

	const r = Math.sqrt(sum)
	for (let i = 0; i < n; i++) {
		values[i] /= r
	}

	return values
}

module.exports = { sampleSphere }
