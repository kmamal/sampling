const { random } = require('@kmamal/util/random/random')

const sampleUnscaledExponential = () => -Math.log(1.0 - random())

const sampleExponential = (scale) => scale * sampleUnscaledExponential()

module.exports = { sampleExponential }
