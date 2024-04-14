const { uniform } = require('@kmamal/util/random/uniform')

let hasSample = false
let sample

const _sampleNormal = () => {
	if (hasSample) {
		hasSample = false
		return sample
	}

	// Box-Muller transform

	let r
	let x
	let y
	do {
		x = 2 * uniform() - 1
		y = 2 * uniform() - 1
		r = x * x + y * y
	}
	while (r >= 1.0 || r === 0.0)

	const f = Math.sqrt(-2.0 * Math.log(r) / r)
	x *= f
	y *= f

	sample = y
	hasSample = true

	return x
}

const sampleNormal = (m, s) => m + s * _sampleNormal()

module.exports = {
	_sampleNormal,
	sampleNormal,
}
