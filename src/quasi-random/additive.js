const { PI } = Math

class Additive {
	constructor (start, step) {
		this._step = step || PI
		this.start(start || 0)
	}

	start (start) {
		this._value = start
	}

	random () {
		this._value += this._step
		this._value %= 1
		return this._value
	}
}

module.exports = { Additive }
