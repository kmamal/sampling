const { uniform } = require('@kmamal/util/random/uniform')
const { _sampleGamma } = require('./gamma')

const sampleBeta = (a, b) => {
	if (a > 1 || b > 1) {
		const x = _sampleGamma(a)
		const y = _sampleGamma(b)
		return x / (x + y)
	}

	// Johnk's algorithm

	for (;;) {
		const U = uniform()
		const V = uniform()
		const X = U ** (1 / a)
		const Y = V ** (1 / b)

		if (X + Y <= 1) {
			if (X + Y > 0) {
				return X / (X + Y)
			}

			let logX = Math.log(U) / a
			let logY = Math.log(V) / b
			const logM = logX > logY ? logX : logY
			logX -= logM
			logY -= logM

			return Math.exp(logX - Math.log(Math.exp(logX) + Math.exp(logY)))
		}
	}
}

module.exports = { sampleBeta }
