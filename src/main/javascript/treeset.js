/*global collectionjs */
(function(collectionjs, helper) {
	var createCollectionOptions = helper.createCollectionOptions;
	
	/**
	 * 
	 */
	collectionjs.newTreeSet = function() {
		var options = createCollectionOptions(arguments);
		var mapOptions = {};
		if (options.comparer) {
			mapOptions.keyComparer = options.comparer;
		}

		var treeMap = collectionjs.newTreeMap(mapOptions);
		var treeSet = collectionjs.newSetFromMap(treeMap);
		if (options.iterable) {
			treeSet.addAll(options.iterable);
		}
		return treeSet;
	};
}(collectionjs, collectionjs.__transporter__));