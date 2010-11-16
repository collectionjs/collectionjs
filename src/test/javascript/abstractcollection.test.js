(function() {
	module("abstractCollection");

	// This is to test the most basic implementation of a collection to make
	// sure that all of the abstract methods work (since other subclasses may
	// overwrite them to get better performance).

	var unmodifiableConstructorFunction = function(array) {
		if (array === undefined) {
			array = [];
		}

		var collection = {
		    size : function() {
			    return array.length;
		    },

		    iterator : function() {
			    var i = 0;
			    return {
			        hasNext : function() {
				        return i < array.length;
			        },
			        next : function() {
				        return array[i++];
			        }
			    };
		    }
		};
		return collectionjs.newAbstractCollection(collection);
	};

	var createUnmodifiableCollectionCallback = function(prefix) {
		return testUtil.createTestGenerator(unmodifiableConstructorFunction, prefix);
	};
	testUtil.each(createCollectionTests( {
	    remove : false,
	    add : false
	}), createUnmodifiableCollectionCallback("unmodifiable collection"));
	
	// TODO: add a fully modifiable version
})();