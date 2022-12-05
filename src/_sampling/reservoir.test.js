const { test } = require('@kmamal/testing')
const { withHooks } = require('@kmamal/util/map/with-hooks')
const { sum } = require('@kmamal/util/array/sum')
const { sampleIndexesFromReservoir } = require('.')

const toAsyncIterable = async function * (arr) {
	for (const x of arr) {
		await new Promise(process.nextTick)
		yield x
	}
}

test("sampling.sampleIndexesFromReservoir Edge-cases", async (t) => {
	t.equal(await sampleIndexesFromReservoir(toAsyncIterable([]), 3), [])
	t.equal(await sampleIndexesFromReservoir(toAsyncIterable([ 3 ]), 3), [ 0 ])
})

test("sampling.sampleIndexesFromReservoir Frequencies", async (t) => {
	const arr = [ 1, 2, 3, 4, 5 ]
	const N = 3
	const R = 10000

	const counts = withHooks({ factory: () => 0 })
	for (let i = 0; i < R; i++) {
		const indexes = await sampleIndexesFromReservoir(toAsyncIterable(arr), N)
		for (const index of indexes) {
			counts.set(index, counts.get(index) + 1)
		}
	}

	for (let i = 0; i < arr.length; i++) {
		const count = counts.get(i)
		const expected = N * R / arr.length
		const ratio = count / expected
		t.ok(ratio > 0.9 && ratio < 1.1)
	}
})
