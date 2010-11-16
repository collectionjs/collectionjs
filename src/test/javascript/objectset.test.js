(function() {
	module("objectset");

	var options = {data: ["one", "two", "three", "four", "five"]};
	var createCallback = function(prefix) {
		return testUtil.createTestGenerator(collectionjs.newObjectSet, prefix);
	};

	testUtil.each(createIterableConstructorTests(options), createCallback("constructor"));
	testUtil.each(createIterableTests(options), createCallback("iterable"));
	testUtil.each(createCollectionTests(options), createCallback("collection"));
	testUtil.each(createSetTests(options), createCallback("set"));
})();

(function() {
	module("objectset-collisions");

	var equalityComparer = {
	    equals : function(a, b) {
		    return a === b;
	    },
	    hashString : function() {
		    return "test";
	    }
	};
	var createCallback = function(prefix) {
		var constructor = function(array) {
			return collectionjs.newObjectSet(array, {equalityComparer: equalityComparer});
		};
		return testUtil.createTestGenerator(constructor, prefix);
	};

	var options = {data: [1, 2, 3, 4, 5]};
	testUtil.each(createIterableConstructorTests(options), createCallback("constructor"));
	testUtil.each(createIterableTests(options), createCallback("iterable"));
	testUtil.each(createCollectionTests(options), createCallback("collection"));
	testUtil.each(createSetTests(options), createCallback("set"));
})();