const { random } = require('@kmamal/util/random/random')

let hasSample = false
let sample

const sampleNormal = () => {
	if (hasSample) {
		hasSample = false
		return sample
	}

	// Box-Muller transform

	let r
	let x1
	let x2
	do {
		x1 = 2 * random() - 1
		x2 = 2 * random() - 1
		r = x1 * x1 + x2 * x2
	}
	while (r >= 1.0 || r === 0.0)

	const f = Math.sqrt(-2.0 * Math.log(r) / r)
	x1 *= f
	x2 *= f

	sample = x1
	hasSample = true

	return x2
}

module.exports = { sampleNormal }
