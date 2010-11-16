(function() {
	module("treemap");

	var testEntryData = [];
	testEntryData.push(testUtil.createEntry(1, "one"));
	testEntryData.push(testUtil.createEntry(2, "two"));
	testEntryData.push(testUtil.createEntry(3, "three"));
	testEntryData.push(testUtil.createEntry(4, "four"));
	testEntryData.push(testUtil.createEntry(5, "five"));
	
	var entryComparer = function(a, b) {
		return a.key === b.key;
	};
	
	var mapOptions = {data: testEntryData, elementComparer: entryComparer};
	var createMapCallback = function(prefix) {
		return testUtil.createTestGenerator(collectionjs.newTreeMap, prefix);
	};

	testUtil.each(createMapTests(mapOptions), createMapCallback("map"));
})();