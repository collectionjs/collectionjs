(function() {
	module("linkedList");

	var createLinkedListCallback = function(prefix) {
		return testUtil.createTestGenerator(collectionjs.newLinkedList, prefix);
	};

	testUtil.each(createIterableConstructorTests(), createLinkedListCallback("constructor"));
	testUtil.each(createIterableTests(), createLinkedListCallback("iterable"));
	testUtil.each(createCollectionTests(), createLinkedListCallback("collection"));
	testUtil.each(createListTests(), createLinkedListCallback("list"));
	testUtil.each(createSubListTests(), createLinkedListCallback("sublist"));
})();