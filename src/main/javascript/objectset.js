/*global collectionjs */
(function(collectionjs, transporter) {
	var createCollectionOptions = transporter.createCollectionOptions;

	collectionjs.newObjectSet = function() {
		var options = createCollectionOptions(arguments);
		var mapOptions = {
			keyEqualityComparer : options.equalityComparer
		};

		var objectMap = collectionjs.newObjectMap(mapOptions);
		var objectSet = collectionjs.newSetFromMap(objectMap);
		if (options.iterable) {
			objectSet.addAll(options.iterable);
		}
		return objectSet;
	};
}(collectionjs, collectionjs.__transporter__));