const { test } = require('@kmamal/testing')
const { withHooks } = require('@kmamal/util/map/with-hooks')
const { sampleValues } = require('.')

test("sampling.sampleValues Edge-cases", (t) => {
	t.equal([ ...sampleValues([], 0) ], [])
	t.throws(() => [ ...sampleValues([], 3) ])
	t.throws(() => [ ...sampleValues([ 6, 7 ], 3) ])
	t.equal([ ...sampleValues([ 6, 7, 8 ], 3) ], [ 6, 7, 8 ])
})

test("sampling.sampleValues Frequencies", (t) => {
	const a = [ 5, 6, 7, 8, 9 ]
	const N = 3
	const R = 1000

	const counts = withHooks({ factory: () => 0 })
	for (let i = 0; i < R; i++) {
		const sampled = [ ...sampleValues(a, N) ]
		t.equal(sampled.length, N)

		for (const index of sampled) {
			counts.set(index, counts.get(index) + 1)
		}
	}

	const expected = R * N / a.length
	for (const x of a) {
		const count = counts.get(x)
		const ratio = count / expected
		t.ok(ratio > 0.9 && ratio < 1.1, { ratio })
	}
})
