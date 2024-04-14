const { uniform } = require('@kmamal/util/random/uniform')

class Offset {
	constructor (start, options) {
		this._random = options?.random ?? uniform
		this.start(start || 0)
	}

	start (start) {
		this._value = start
	}

	random () {
		this._value += 0.5 + (this._random() / 2)
		this._value %= 1
		return this._value
	}
}

module.exports = { Offset }
