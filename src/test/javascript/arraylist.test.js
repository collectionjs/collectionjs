(function() {
	module("arrayList");

	var createArrayListCallback = function(prefix) {
		return testUtil.createTestGenerator(collectionjs.newArrayList, prefix);
	};

	testUtil.each(createIterableConstructorTests(), createArrayListCallback("constructor"));
	testUtil.each(createIterableTests(), createArrayListCallback("iterable"));
	testUtil.each(createCollectionTests(), createArrayListCallback("collection"));
	testUtil.each(createListTests(), createArrayListCallback("list"));
	testUtil.each(createSubListTests(), createArrayListCallback("sublist"));
})();