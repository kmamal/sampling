const { uniform } = require('@kmamal/util/random/uniform')
const { Heap } = require('@kmamal/heap')
const { identity } = require('@kmamal/util/function/identity')

const getIndex = (x, i) => i

const __sampleWeightedReservoir = async (dst, dstStart, iterable, n, selector, fn, options) => {
	const getRandom = options?.random ?? uniform

	let index = 0
	const heap = new Heap()

	const getScore = (w) => getRandom() ** (1 / w)

	sampling: {
		const iterator = iterable[Symbol.asyncIterator](iterable)
		while (index < n) {
			const { value, done } = await iterator.next()
			if (done) { break sampling }
			const w = fn(value)
			const r = getScore(w)
			heap.add(r, selector(value, index++))
		}

		for (;;) {
			const { value, done } = await iterator.next()
			if (done) { break sampling }
			const w = fn(value)
			const r = getScore(w)
			const { prio } = heap.min()
			if (r > prio) {
				heap.pop()
				heap.add(r, selector(value, index))
			}
			index += 1
		}
	}

	let writeIndex = dstStart
	while (heap.size > 0) {
		dst[writeIndex++] = heap.pop().value
	}

	return Math.min(index, n)
}

const sampleIndexesFromWeightedReservoirBy = async (iterable, n, fn, options) => {
	const res = new Array(n)
	const m = await __sampleWeightedReservoir(res, 0, iterable, n, getIndex, fn, options)
	res.length = m
	return res
}

const sampleIndexesFromWeightedReservoir = (iterable, n, options) => sampleIndexesFromWeightedReservoirBy(iterable, n, identity, options)

const sampleValuesFromWeightedReservoirBy = async (iterable, n, fn, options) => {
	const res = new Array(n)
	const m = await __sampleWeightedReservoir(res, 0, iterable, n, identity, fn, options)
	res.length = m
	return res
}

module.exports = {
	__sampleWeightedReservoir,
	sampleIndexesFromWeightedReservoirBy,
	sampleIndexesFromWeightedReservoir,
	sampleValuesFromWeightedReservoirBy,
}
