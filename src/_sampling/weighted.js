const { random } = require('@kmamal/util/random/random')
const { __binarySearchLeft } = require('@kmamal/util/array/search/binary')
const { prefixSumsBy } = require('@kmamal/util/array/prefix-sums')
const { identity } = require('@kmamal/util/function/identity')

const __chooseWeighted = (arr, start, end, fn, options) => {
	const length = end - start
	if (length === 0) { return -1 }

	const getRandom = options?.random ?? random

	const total = arr[end - 1]
	const r = getRandom() * total
	return __binarySearchLeft(arr, start, end, r, (a, b) => fn(a) - fn(b))
}

const chooseIndexFromPrefixSumsBy = (arr, fn, options) => __chooseWeighted(arr, 0, arr.length, fn, options)

const chooseValueFromPrefixSumsBy = (arr, fn, options) => {
	const index = chooseIndexFromPrefixSumsBy(arr, fn, options)
	return arr[index]
}

const chooseIndexFromPrefixSums = (arr, options) => chooseIndexFromPrefixSumsBy(arr, identity, options)

const chooseIndexFromWeightedBy = (arr, fn) => {
	const sums = prefixSumsBy(arr, fn)
	return chooseIndexFromPrefixSums(sums)
}

const chooseValueFromWeightedBy = (arr, fn) => {
	const index = chooseIndexFromWeightedBy(arr, fn)
	return arr[index]
}

const chooseIndexFromWeighted = (arr) => chooseIndexFromWeightedBy(arr, identity)

module.exports = {
	__chooseWeighted,
	chooseIndexFromPrefixSumsBy,
	chooseValueFromPrefixSumsBy,
	chooseIndexFromPrefixSums,
	chooseIndexFromWeightedBy,
	chooseValueFromWeightedBy,
	chooseIndexFromWeighted,
}
