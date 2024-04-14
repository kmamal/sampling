const { uniform } = require('@kmamal/util/random/uniform')
const { _sampleExponential } = require('./exponential')
const { _sampleNormal } = require('./normal')

const _sampleGamma = (shape) => {
	let U
	let V
	let X
	let Y

	if (shape === 1) {
		return _sampleExponential()
	}

	if (shape < 1.0) {
		for (;;) {
			U = uniform()
			V = _sampleExponential()

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
			X = _sampleNormal()
			V = 1 + c * X
		} while (V <= 0)

		V *= V * V
		X *= X
		U = uniform()
		if (
			U < 1 - 0.0331 * X * X
			|| Math.log(U) < 0.5 * X + b * (1 - V + Math.log(V))
		) {
			return b * V
		}
	}
}

const sampleGamma = (shape, scale) => scale * _sampleGamma(shape)

module.exports = {
	_sampleGamma,
	sampleGamma,
}
