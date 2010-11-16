(function() {
	module("objectmap-simple");

	var testEntryData = [];
	testEntryData.push(testUtil.createEntry(1, "one"));
	testEntryData.push(testUtil.createEntry(2, "two"));
	testEntryData.push(testUtil.createEntry(3, "three"));
	testEntryData.push(testUtil.createEntry(4, "four"));
	testEntryData.push(testUtil.createEntry(5, "five"));
	
	var entryComparer = function(a, b) {
		// String compare because all keys in an objectMap are converted to
		// strings
		return a.key.toString() === b.key.toString();
	};

	var mapOptions = {data: testEntryData, elementComparer: entryComparer};
	var createMapCallback = function(prefix) {
		return testUtil.createTestGenerator(collectionjs.newObjectMap, prefix);
	};
	testUtil.each(createMapTests(mapOptions), createMapCallback("map"));
})();

(function() {
	module("objectmap-collision-handling");

	var testEntryData = [];
	testEntryData.push(testUtil.createEntry(1, "one"));
	testEntryData.push(testUtil.createEntry(2, "two"));
	testEntryData.push(testUtil.createEntry(3, "three"));
	testEntryData.push(testUtil.createEntry(4, "four"));
	testEntryData.push(testUtil.createEntry(5, "five"));
	
	var entryComparer = function(a, b) {
		return a.key === b.key;
	};
	var keyEqualityComparer = {
		equals: function(a, b) {
			return a === b;
		},
		hashString: function(a) {
			// Always the same hashString so that every element collides
			return "test";
		}
	};

	var createMapCallback = function(prefix) {
		var constructorWithOptions = function(obj) {
			return collectionjs.newObjectMap(obj, { keyEqualityComparer: keyEqualityComparer	});
		};
		return testUtil.createTestGenerator(constructorWithOptions, prefix);
	};
	
	var mapOptions = {data: testEntryData, elementComparer: entryComparer};
	testUtil.each(createMapTests(mapOptions), createMapCallback("map"));
})();