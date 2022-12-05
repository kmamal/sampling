const { random } = require('@kmamal/util/random/random')

class Offset {
	constructor (start, options) {
		this._random = options?.random ?? random
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
