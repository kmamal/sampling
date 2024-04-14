const { rand } = require('@kmamal/util/random/rand')
const { uniform } = require('@kmamal/util/random/uniform')
const { swap } = require('@kmamal/util/array/swap')

// Generates surface points

const sampleBox = (n) => {
	const values = new Array(n)

	values[0] = uniform() > 0.5 ? -1 : 1
	for (let i = 1; i < n; i++) {
		values[i] = uniform() * 2 - 1
	}

	swap.$$$(values, 0, rand(0, n))
	return values
}

module.exports = { sampleBox }
