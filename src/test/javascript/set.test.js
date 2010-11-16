var createSetTests = function(options) {
	var defaultOptions = {
	    data : [ 1, 2, 3, 4, 5 ], 
	    elementComparer : collectionjs.newEqualityComparer().equals
	};
	options = testUtil.extend(defaultOptions, options);

	var data = options.data;
	var elementComparer = options.elementComparer;
	var elementEquals = function(actual, expected, message) {
		return testUtil.equalsUsingComparer(elementComparer, actual, expected, message);
	};

	var tests = {
		constructorContainsNoDuplicateElements : function(constructorFunction) {
			var c = constructorFunction([data[1], data[1], data[1]]);
			equals(c.size(), 1);
			elementEquals(c.iterator().next(), data[1]);
		},
			
	    sizeSameAfterRepeatedlyAddingSameElement : function(constructorFunction) {
			if (typeof constructorFunction().add !== 'function') {
			    ok(true, "not tested because add is an optional method");
			    return;
		    }

		    var c = constructorFunction([data[0]]);
		    equals(c.size(), 1);
		    
		    c.add(data[0]);
		    c.add(data[0]);
		    c.add(data[0]);
		    
		    equals(c.size(), 1);
	    },
	    
	    sizeSameAfterAllAllWithDuplicateElements : function(constructorFunction) {
			if (typeof constructorFunction().add !== 'function'
					&& typeof constructorFunction().addAll !== 'function') {
			    ok(true, "not tested because addAll is an optional method");
			    return;
		    }

		    var c = constructorFunction([data[0]]);
		    equals(c.size(), 1);
		    
		    c.addAll([data[0], data[0], data[0]]);
		    equals(c.size(), 1);
	    }
	};
	
	// TODO: add repeatedly returns false
	
	return tests;
};