(function() {
	module("treeset");

	var options = {data: ["one", "two", "three", "four", "five"]};
	var createCallback = function(prefix) {
		return testUtil.createTestGenerator(collectionjs.newTreeSet, prefix);
	};

	testUtil.each(createIterableConstructorTests(options), createCallback("constructor"));
	testUtil.each(createIterableTests(options), createCallback("iterable"));
	testUtil.each(createCollectionTests(options), createCallback("collection"));
	testUtil.each(createSetTests(options), createCallback("set"));
})();