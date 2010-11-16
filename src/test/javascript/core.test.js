var testUtil = {
    // A helper function for iterating through the properties of an object.
    // (so each call to the callback function will have its own scope).
    each : function(object, callback) {
	    for ( var key in object) {
		    callback.call(object, key, object[key]);
	    }
    },

    // A very simplified version of the jQuery extend method (used to set
    // default options).
    extend : function() {
	    var target = arguments[0] || {};
	    var objects = Array.prototype.slice.call(arguments, 1);

	    for ( var i = 0; i < objects.length; i++) {
	    	var o = objects[i];
		    for ( var key in o) {
			    target[key] = o[key];
		    }
	    }

	    return target;
    },

    // Works like the normal QUnit equals method except that it uses the given
    // comparer to do the comparison.
    // This is necessary for something like a map that has entry objects as its
	// elements
    equalsUsingComparer : function(comparer, actual, expected, message) {
	    var message = (message ? message + ", " : "") + "expected: <"
	            + expected + "> result: <" + actual + ">";
	    return ok(comparer(actual, expected), message);
    },
    
    // Creates a function that creates tests. This is not overly complicated in
	// any way, no sir.
    createTestGenerator : function(constructor, prefix) {
	    return function(key, testFunction) {
		    test(prefix + " " + key, function() {
			    testFunction(constructor);
		    });
	    };
    },

    isArray : function(maybeArray) {
	    return Object.prototype.toString.call(maybeArray) === '[object Array]';
	},

	toIterable : function(iterableOrArray) {
	    if (iterableOrArray === undefined) {
		    throw new ReferenceError('iterableOrArray');
	    }
	
	    if (collectionjs.isIterable(iterableOrArray)) {
		    return iterableOrArray;
	    }
	    else if (testUtil.isArray(iterableOrArray)) {
	    	var array = iterableOrArray;
		    return {
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
	    }
	    else {
		    throw new TypeError(
		            'iterableOrArray is not an iterable or an array');
	    }
	}, 
	
	createEntry: function(k, v) {
		return {
		    key: k,
		    value: v,
		    toString : function() {
			    return k + " = " + v;
		    }
		};
	}
};

var createIterableConstructorTests = function(options) {
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

	var iterableContains = function(iterable, element) {
		var iter = iterable.iterator();
		while (iter.hasNext()) {
			var nextElement = iter.next();
			if (elementComparer(element, nextElement) === true) {
				return true;
			}
		}
		return false;
	};

	var tests = {
		empty : function(constructorFunction) {
			var c = constructorFunction();

			var iter = c.iterator();
			equals(iter.hasNext(), false);
		},
		
		arrayOneElement : function(constructorFunction) {
			var a = [data[1]];
			var c = constructorFunction(a);

			var iter = c.iterator();
			elementEquals(iter.next(), data[1]);
			equals(iter.hasNext(), false);
		},
		
		arrayMultipleElements : function(constructorFunction) {
			var a = [data[0], data[1], data[2]];
			var c = constructorFunction(a);
			
			var iter = c.iterator();
			iter.next();
			iter.next();
			iter.next();
			equals(iter.hasNext(), false);

			equals(iterableContains(c, data[0]), true);
		    equals(iterableContains(c, data[1]), true);
		    equals(iterableContains(c, data[2]), true);
		},
		
		iterableOneElement : function(constructorFunction) {
			var array = [data[1]];
			var iterable = collectionjs.newIterableFromArray(array);

			var c = constructorFunction(iterable);
		
			var iter = c.iterator();
			elementEquals(iter.next(), data[1]);
			equals(iter.hasNext(), false);
		}, 
		
		iterableMultipleElement : function(constructorFunction) {
		    var array = [ data[0], data[1], data[2] ];
		    var iterable = collectionjs.newIterableFromArray(array);

		    var c = constructorFunction(iterable);

		    var iter = c.iterator();
		    iter.next();
		    iter.next();
		    iter.next();
		    equals(iter.hasNext(), false);

		    equals(iterableContains(c, data[0]), true);
		    equals(iterableContains(c, data[1]), true);
		    equals(iterableContains(c, data[2]), true);
	    },

		objectAsSecondParamterDoesNotBreakAnything : function(constructorFunction) {
			var c = constructorFunction([data[1]], {});
			var iter = c.iterator();
			elementEquals(iter.next(), data[1]);
			equals(iter.hasNext(), false);
		},

	    stringParameterBreaks : function(constructorFunction) {
		    try {
			    constructorFunction('test');
			    ok(false, "did not throw error");
		    }
		    catch (expected) {
			    ok(expected instanceof Error, "expected Error");
		    }
	    },
	    
	    numberParameterBreaks : function(constructorFunction) {
		    try {
			    constructorFunction(2);
			    ok(false, "did not throw error");
		    }
		    catch (expected) {
			    ok(expected instanceof Error, "expected Error");
		    }
	    }, 
	    
	    booleanParameterBreaks : function(constructorFunction) {
		    try {
			    constructorFunction(true);
			    ok(false, "did not throw error");
		    }
		    catch (expected) {
			    ok(expected instanceof Error, "expected Error");
		    }
	    },
	    
	    nullParameterBreaks : function(constructorFunction) {
		    try {
			    constructorFunction(null);
			    ok(false, "did not throw error");
		    }
		    catch (expected) {
			    ok(expected instanceof Error, "expected Error");
		    }
	    },
	    
	    functionParameterBreaks : function(constructorFunction) {
		    try {
			    constructorFunction(function() {});
			    ok(false, "did not throw error");
		    }
		    catch (expected) {
			    ok(expected instanceof Error, "expected Error");
		    }
	    }
	};
	return tests;
};


var createIterableTests = function(options) {
	var defaultOptions = {
	    data : [ 1, 2, 3, 4, 5 ],
	    elementComparer : collectionjs.newEqualityComparer().equals,
	    remove: true
	};
	options = testUtil.extend(defaultOptions, options);

	var data = options.data;
	var elementComparer = options.elementComparer;
	
	var elementEquals = function(actual, expected, message) {
		return testUtil.equalsUsingComparer(elementComparer, actual, expected, message);
	};

	var tests = {
		iteratorEmpty : function(constructorFunction) {
			var iterable = constructorFunction();
			var iter = iterable.iterator();

			equals(iter.hasNext(), false);
		},
		
		iteratorOneElement : function(constructorFunction) {
			var iterable = constructorFunction([data[0]]);
			var iter = iterable.iterator();
			
			equals(iter.hasNext(), true);
			elementEquals(iter.next(), data[0]);
			equals(iter.hasNext(), false);
		},
		
		iteratorMultipleElementsCorrectNumberOfElements : function(constructorFunction) {
		    var iterable = constructorFunction( [ data[0], data[1], data[2] ]);

		    var iter = iterable.iterator();
			iter.next();
			iter.next();
			iter.next();
			equals(iter.hasNext(), false);
		}, 

		iteratorMultipleElementsContainsEachElement : function(constructorFunction) {
		    var iterable = constructorFunction( [ data[0], data[1], data[2] ]);

			// Verify the data (but not the order because there are no
			// restrictions on that in the iterable interface)
			var iterableContains = function(iterable, element) {
				var iter = iterable.iterator();
				while (iter.hasNext()) {
					var nextElement = iter.next();
					if (elementComparer(element, nextElement) === true) {
						return true;
					}
				}
				return false;
			};
			equals(iterableContains(iterable, data[0]), true);
			equals(iterableContains(iterable, data[1]), true);
			equals(iterableContains(iterable, data[2]), true);
		},

	    iteratorOutOfRangeOnEmptyIterable : function(constructorFunction) {
		    var iterable = constructorFunction();
		    var iter = iterable.iterator();

		    equals(iter.hasNext(), false);
		    try {
			    iter.next();
			    ok(false, "did not throw error");
		    }
		    catch (expected) {
			    ok(expected instanceof RangeError, "expected RangeError");
		    }
	    },

	    iteratorOutOfRange : function(constructorFunction) {
	    	var iterable = constructorFunction( [ data[0], data[1] ]);

			var iter = iterable.iterator();
			iter.next();
			iter.next();
			equals(iter.hasNext(), false);

			try {
			    iter.next();
			    ok(false, "did not throw error");
		    }
		    catch (expected) {
			    ok(expected instanceof RangeError, "expected RangeError");
		    }
	    },

	    multipleIteratorsAreIndependent : function(constructorFunction) {
			var iterable = constructorFunction( [ data[0], data[1] ]);
		
			var iter1 = iterable.iterator();
			var iter2 = iterable.iterator();
			
			iter1.next();
			iter2.next();
			
			equals(iter1.hasNext(), true);
			equals(iter2.hasNext(), true);

			iter1.next();
			
			equals(iter1.hasNext(), false);
			equals(iter2.hasNext(), true);

			iter2.next();

			equals(iter1.hasNext(), false);
			equals(iter2.hasNext(), false);
	    }
	};

	if (options.remove === true) {
		var removeTests = {
		    removeOnlyElement : function(constructorFunction) {
			    var iterable = constructorFunction( [ data[0] ]);
			    var iter = iterable.iterator();
			    iter.next();
			    iter.remove();

			    equals(iterable.iterator().hasNext(), false);
		    },

		    removeTwoElements : function(constructorFunction) {
			    var iterable = constructorFunction( [ data[0], data[1] ]);
			    var iter = iterable.iterator();

			    var firstRemoved = iter.next();
			    iter.remove();

			    ok(iterable.iterator().next() !== firstRemoved);

			    var secondRemoved = iter.next();
			    iter.remove();

			    ok(firstRemoved !== secondRemoved);

			    equals(iterable.iterator().hasNext(), false);
		    },

		    removeBeforeNext : function(constructorFunction) {
			    var iterable = constructorFunction( [ data[0], data[1] ]);
			    var iter = iterable.iterator();

			    try {
				    iter.remove();
				    ok(false, "did not throw error");
			    }
			    catch (expected) {
				    ok(expected instanceof Error, "expected Error");
			    }
		    },

		    removeTwiceAfterNext : function(constructorFunction) {
			    var iterable = constructorFunction( [ data[0], data[1] ]);
			    var iter = iterable.iterator();

			    iter.next();
			    iter.remove();

			    try {
				    iter.remove();
				    ok(false, "did not throw error");
			    }
			    catch (expected) {
				    ok(expected instanceof Error, "expected Error");
			    }
		    }
		};

		tests = testUtil.extend(tests, removeTests);
	}

	return tests;
};