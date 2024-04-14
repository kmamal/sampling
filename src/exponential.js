const { uniform } = require('@kmamal/util/random/uniform')

const _sampleExponential = () => -Math.log(1 - uniform())

const sampleExponential = (scale) => scale * _sampleExponential()

module.exports = {
	_sampleExponential,
	sampleExponential,
}
