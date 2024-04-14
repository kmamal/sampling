const { uniform } = require('@kmamal/util/random/uniform')
const { rand } = require('@kmamal/util/random/rand')
const { identity } = require('@kmamal/util/function/identity')

const getIndex = (x, i) => i

const __sampleReservoir1 = async (dst, dstStart, iterable, n, selector, options) => {
	let index = 0
	let writeIndex = dstStart
	const dstEnd = dstStart + n

	const iterator = iterable[Symbol.asyncIterator](iterable)
	while (writeIndex < dstEnd) {
		const { value, done } = await iterator.next()
		if (done) { return writeIndex - dstStart }
		dst[writeIndex++] = selector(value, index++)
	}

	for (;;) {
		const { value, done } = await iterator.next()
		if (done) { return n }
		const r = rand(index + 1, options)
		if (r < n) {
			dst[dstStart + r] = selector(value, index)
		}
		index += 1
	}
}

const __sampleReservoir2 = async (dst, dstStart, iterable, n, selector, options) => {
	let index = 0
	let writeIndex = dstStart
	const dstEnd = dstStart + n

	const iterator = iterable[Symbol.asyncIterator](iterable)
	while (writeIndex < dstEnd) {
		const { value, done } = await iterator.next()
		if (done) { return writeIndex - dstStart }
		dst[writeIndex++] = selector(value, index++)
	}

	const getRandom = options?.random ?? uniform
	let W = Math.exp(Math.log(getRandom()) / n)

	for (;;) {
		const nextIndex = index + Math.floor(Math.log(getRandom()) / Math.log(1 - W)) + 1
		while (index < nextIndex) {
			const { done } = await iterator.next()
			if (done) { return n }
			index += 1
		}

		const { value, done } = await iterator.next()
		if (done) { return n }
		index += 1

		dst[dstStart + rand(n, options)] = selector(value, index)
		W *= Math.exp(Math.log(getRandom()) / n)
	}
}

const sampleIndexesFromReservoir = async (iterable, n) => {
	const res = new Array(n)
	const m = await __sampleReservoir1(res, 0, iterable, n, getIndex)
	res.length = m
	return res
}

const sampleValuesFromReservoir = async (iterable, n) => {
	const res = new Array(n)
	const m = await __sampleReservoir1(res, 0, iterable, n, identity)
	res.length = m
	return res
}

module.exports = {
	__sampleReservoir1,
	__sampleReservoir2,
	sampleIndexesFromReservoir,
	sampleValuesFromReservoir,
}
