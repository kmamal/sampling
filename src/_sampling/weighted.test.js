const { test } = require('@kmamal/testing')
const { withHooks } = require('@kmamal/util/map/with-hooks')
const { sum } = require('@kmamal/util/array/sum')
const { chooseIndexFromWeighted } = require('.')

test("sampling.chooseIndexFromWeighted Edge-cases", (t) => {
	t.equal(chooseIndexFromWeighted([]), -1)
	t.equal(chooseIndexFromWeighted([ 1 ]), 0)
})

test("sampling.chooseIndexFromWeighted Frequencies", (t) => {
	const arr = [ 1, 3, 2 ]
	const N = 3000

	const counts = withHooks({ factory: () => 0 })
	for (let i = 0; i < N; i++) {
		const index = chooseIndexFromWeighted(arr)
		counts.set(index, counts.get(index) + 1)
	}

	const total = sum(arr)
	for (let i = 0; i < arr.length; i++) {
		const count = counts.get(i)
		const expected = N * arr[i] / total
		const ratio = count / expected
		t.ok(ratio > 0.9 && ratio < 1.1, { ratio })
	}
})
