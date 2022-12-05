const { random } = require('@kmamal/util/random/random')
const { Heap } = require('@kmamal/structs/heap')
const { identity } = require('@kmamal/util/function/identity')

const getIndex = (x, i) => i

const __sampleWeightedReservoir = async (dst, dstStart, iterable, n, selector, fn, options) => {
	const getRandom = options?.random ?? random

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

	let write_index = dstStart
	while (heap.size > 0) {
		dst[write_index++] = heap.pop().value
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
