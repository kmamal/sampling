const { random } = require('@kmamal/util/random/random')
const { sampleExponential } = require('./exponential')
const { sampleNormal } = require('./normal')

const sampleUnscaledGamma = (shape) => {
	let U
	let V
	let X
	let Y

	if (shape === 1) {
		return sampleExponential(1)
	}

	if (shape < 1.0) {
		for (;;) {
			U = random()
			V = sampleExponential(1)

			if (U <= 1 - shape) {
				X = U ** (1 / shape)
				if (X <= V) {
					return X
				}
			} else {
				Y = -Math.log((1 - U) / shape)
				X = (1 - shape + shape * Y) ** (1 / shape)
				if (X <= (V + Y)) {
					return X
				}
			}
		}
	}

	const b = shape - 1 / 3
	const c = 1 / Math.sqrt(9 * b)
	for (;;) {
		do {
			X = sampleNormal()
			V = 1 + c * X
		} while (V <= 0)

		V *= V * V
		X *= X
		U = random()
		if (
			U < 1 - 0.0331 * X * X
			|| Math.log(U) < 0.5 * X + b * (1 - V + Math.log(V))
		) {
			return b * V
		}
	}
}

const sampleGamma = (shape, scale) => scale * sampleUnscaledGamma(shape)

module.exports = {
	sampleUnscaledGamma,
	sampleGamma,
}
