const { uniform } = require('@kmamal/util/random/uniform')

const _cacheForFactorial = [ 0, 1 ]
const factorial = (n) => {
	const { length } = _cacheForFactorial
	if (n < length) { return _cacheForFactorial[n] }

	let fac = _cacheForFactorial[length - 1]
	for (let i = length; i <= n; i++) {
		fac = _cacheForFactorial[i] = fac * i
	}
	return fac
}


const _cacheForLogFactorial = []
const logFactorial = (n) => {
	if (n < _cacheForLogFactorial.length) { return _cacheForLogFactorial[n] }
	const result = Math.log(factorial(n))
	_cacheForLogFactorial[n] = result
	return result
}


let rateOldPoU = null
let rateExp = null
let rateOldRoU = null
let rateLog = null
let rateSqrt = null

const _samplePoissonProductOfUniforms = (rate) => {
	if (rate !== rateOldPoU) {
		rateExp = Math.exp(-rate)
	}
	rateOldPoU = rate

	let k = -1
	let t = 1
	do {
		++k
		t *= uniform()
	} while (t > rateExp)
	return k
}

const _samplePoissonRatioOfUniforms = (rate) => {
	if (rate !== rateOldRoU) {
		rateLog = Math.log(rate)
		rateSqrt = Math.sqrt(rate)
	}
	rateOldRoU = rate

	let k
	for (;;) {
		const u = 0.64 * uniform()
		const v = -0.68 + 1.28 * uniform()

		// Outer squeeze for fast rejection
		let v2
		if (rate > 13.5) {
			v2 = Math.sqrt(v)
			if (v >= 0.0) {
				if (v2 > 6.5 * u * (0.64 - u) * (u + 0.2)) { continue }
			} else if (v2 > 9.6 * u * (0.66 - u) * (u + 0.07)) { continue }
		}

		k = Math.floor(rateSqrt * (v / u) + rate + 0.5)
		if (k < 0) { continue }
		const u2 = Math.sqrt(u)

		// Inner squeeze for fast acceptance
		if (rate > 13.5) {
			if (v >= 0.0) {
				if (v2 < 15.2 * u2 * (0.61 - u) * (0.8 - u)) { break }
			} else if (v2 < 6.76 * u2 * (0.62 - u) * (1.4 - u)) { break }
		}

		// Only when we must
		const p = rateSqrt * Math.exp(-rate + k * rateLog - logFactorial(k))
		if (u2 < p) { break }
	}

	return k
}

const samplePoisson = (rate) => rate < 65
	? _samplePoissonProductOfUniforms(rate)
	: _samplePoissonRatioOfUniforms(rate)

module.exports = { samplePoisson }
