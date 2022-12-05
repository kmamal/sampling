const { randInt } = require('@kmamal/util/random/rand-int')
const { random } = require('@kmamal/util/random/random')

const randomPointsInDimensions = (numPoints, numDimensions, options) => {
	const getRandom = options?.random ?? random

	const points = new Array(numPoints)
	const width = 1 / numPoints

	for (let i = 0; i < numPoints; i++) {
		const point = new Array(numDimensions)
		for (let j = 0; j < numDimensions; j++) {
			point[j] = i
		}
		points[i] = point
	}

	const last = numPoints - 1
	for (let i = 0; i < last; i++) {
		const point = points[i]
		for (let j = 0; j < numDimensions; j++) {
			const index = randInt(i, numPoints, options)
			const other = points[index]
			const offset = other[j]
			other[j] = point[j]
			point[j] = (offset + getRandom()) * width
		}
	}

	for (let j = 0; j < numDimensions; j++) {
		points[last][j] = (points[last][j] + getRandom()) * width
	}

	return points
}

module.exports = { randomPointsInDimensions }
