const { rand } = require('@kmamal/util/random/rand')
const { random } = require('@kmamal/util/random/random')
const { swap } = require('@kmamal/util/array/swap')

const sampleBox = (n) => {
	const values = new Array(n)

	values[0] = random() > 0.5 ? -1 : 1
	for (let i = 1; i < n; i++) {
		values[i] = random() * 2 - 1
	}

	swap.$$$(values, 0, rand(0, n))
	return values
}

module.exports = { sampleBox }
