var createCollectionTests = function(options) {
	var defaultOptions = {
	    data : [ 1, 2, 3, 4, 5 ], 
	    elementComparer : collectionjs.newEqualityComparer().equals,
	    add: true, 
	    remove: true
	};
	options = testUtil.extend(defaultOptions, options);

	var data = options.data;
	var elementComparer = options.elementComparer;
	var elementEquals = function(actual, expected, message) {
		return testUtil.equalsUsingComparer(elementComparer, actual, expected,
		        message);
	};

	var tests = {
	    sizeEmpty : function(constructorFunction) {
		    var c = constructorFunction();
		    equals(c.size(), 0);
	    },

	    sizeOneElement : function(constructorFunction) {
		    var c = constructorFunction( [ data[0] ]);
		    equals(c.size(), 1);
	    },

	    sizeTwoElements : function(constructorFunction) {
		    var c = constructorFunction( [ data[0], data[1] ]);
		    equals(c.size(), 2);
	    },

	    containsEmpty : function(constructorFunction) {
		    var c = constructorFunction();
		    equals(c.contains(data[0]), false);
	    },

	    containsFirstElement : function(constructorFunction) {
		    var c = constructorFunction( [ data[0], data[1] ]);
		    equals(c.contains(data[0]), true);
	    },

	    containsMiddleElement : function(constructorFunction) {
		    var c = constructorFunction( [ data[0], data[1], data[2] ]);
		    equals(c.contains(data[1]), true);
	    },

	    containsLastElement : function(constructorFunction) {
		    var c = constructorFunction( [ data[0], data[1], data[2] ]);
		    equals(c.contains(data[2]), true);
	    },

	    containsMissingElement : function(constructorFunction) {
		    var c = constructorFunction( [ data[0], data[2] ]);
		    equals(c.contains(data[1]), false);
	    },
	    
	    containsAllArray_EmptyCollection_EmptyArray : function(constructorFunction) {
		    var c = constructorFunction();
		    equals(c.containsAll( []), true);
	    },
	    
	    containsAllArray_EmptyCollection_NonEmptyArray : function(constructorFunction) {
		    var c = constructorFunction();
		    equals(c.containsAll( [ data[0] ]), false);
	    },
	    
	    containsAllArray_OneElementCollection_True : function(constructorFunction) {
		    var c = constructorFunction( [ data[1] ]);
		    equals(c.containsAll( [ data[1] ]), true);
		    equals(c.containsAll( [ data[1], data[1] ]), true);
	    },
	    
	    containsAllArray_OneElementCollection_False : function(constructorFunction) {
		    var c = constructorFunction( [ data[1] ]);
		    equals(c.containsAll( [ data[0] ]), false);
		    equals(c.containsAll( [ data[0], data[1] ]), false);
	    },
	    
	    containsAllArray_MultipleRepeatedElementCollection_True : function(constructorFunction) {
		    var c = constructorFunction( [ data[1], data[1], data[1], data[1] ]);
		    equals(c.containsAll( []), true);
		    equals(c.containsAll( [ data[1] ]), true);
		    equals(c.containsAll( [ data[1], data[1] ]), true);
	    },
	    
	    containsAllArray_MultipleRepeatedElementCollection_False : function(constructorFunction) {
		    var c = constructorFunction( [ data[1], data[1], data[1], data[1] ]);
		    equals(c.containsAll( [ data[0] ]), false);
		    equals(c.containsAll( [ data[0], data[1] ]), false);
	    },

	    containsAllArray_MultipleElementCollection_True : function(constructorFunction) {
		    var c = constructorFunction( [ data[0], data[1] ]);
		    equals(c.containsAll( []), true);
		    equals(c.containsAll( [ data[1] ]), true);
		    equals(c.containsAll( [ data[1], data[1] ]), true);
		    equals(c.containsAll( [ data[0] ]), true);
		    equals(c.containsAll( [ data[0], data[1] ]), true);
	    },
	    
	    containsAllArray_MultipleElementCollection_False : function(constructorFunction) {
		    var c = constructorFunction( [ data[0], data[1] ]);
		    equals(c.containsAll( [ data[2] ]), false);
		    equals(c.containsAll( [ data[0], data[2] ]), false);
		    equals(c.containsAll( [ data[0], data[1], data[2] ]), false);
	    },

	    containsAllIterable_EmptyCollection_EmptyArray : function(constructorFunction) {
		    var c = constructorFunction();
		    equals(c.containsAll( collectionjs.newIterableFromArray([])), true);
	    },
	    
	    containsAllIterable_EmptyCollection_NonEmptyArray : function(constructorFunction) {
		    var c = constructorFunction();
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[0] ])), false);
	    },
	    
	    containsAllIterable_OneElementCollection_True : function(constructorFunction) {
		    var c = constructorFunction([ data[1] ]);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[1] ])), true);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[1], data[1] ])), true);
	    },
	    
	    containsAllIterable_OneElementCollection_False : function(constructorFunction) {
		    var c = constructorFunction( [ data[1] ]);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[0] ])), false);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[0], data[1] ])), false);
	    },
	    
	    containsAllIterable_MultipleRepeatedElementCollection_True : function(constructorFunction) {
		    var c = constructorFunction( [ data[1], data[1], data[1], data[1] ]);
		    equals(c.containsAll( collectionjs.newIterableFromArray([])), true);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[1] ])), true);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[1], data[1] ])), true);
	    },
	    
	    containsAllIterable_MultipleRepeatedElementCollection_False : function(constructorFunction) {
		    var c = constructorFunction( [ data[1], data[1], data[1], data[1] ]);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[0] ])), false);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[0], data[1] ])), false);
	    },

	    containsAllIterable_MultipleElementCollection_True : function(constructorFunction) {
		    var c = constructorFunction( [ data[0], data[1] ]);
		    equals(c.containsAll( collectionjs.newIterableFromArray([])), true);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[1] ])), true);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[1], data[1] ])), true);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[0] ])), true);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[0], data[1] ])), true);
	    },
	    
	    containsAllIterable_MultipleElementCollection_False : function(constructorFunction) {
		    var c = constructorFunction( [ data[0], data[1] ]);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[2] ])), false);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[0], data[2] ])), false);
		    equals(c.containsAll( collectionjs.newIterableFromArray([ data[0], data[1], data[2] ])), false);
	    },
	    
	    toArrayEmpty : function(constructorFunction) {
		    var c = constructorFunction();
		    
		    ok(c.toArray() instanceof Array, "instanceof Array");
		    equals(c.toArray().length, 0);
	    },
	    
	    toArrayOneElement : function(constructorFunction) {
		    var c = constructorFunction( [ data[1] ]);
		    var a = c.toArray();

		    ok(a instanceof Array, "instanceof Array");
		    equals(a.length, 1);
		    elementEquals(a[0], data[1]);
	    },

	    toArrayMultipleElements : function(constructorFunction) {
		    var c = constructorFunction( [ data[1], data[2], data[0] ]);
		    var a = c.toArray();
		    
		    ok(a instanceof Array, "instanceof Array");
		    equals(a.length, 3);
	    },

	    toArrayIndependentOfCollection : function(constructorFunction) {
		    var c = constructorFunction( [ data[0], data[1] ]);
		    var a = c.toArray();

		    a[0] = data[2];
		    delete a[1];

		    equals(c.size(), 2);
		    equals(c.contains(data[0]), true);
		    equals(c.contains(data[1]), true);
	    }
	};
	
	if (options.remove === true) {
		var removeTests = {
		    iteratorRemoveChangesSize : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[3] ]);

			    var iter = c.iterator();
			    iter.next();
			    iter.remove();

			    equals(c.size(), 2);
			    
			    iter.next();
			    iter.next();
			    iter.remove();

			    equals(c.size(), 1);
			    equals(iter.hasNext(), false);

			    var iter2 = c.iterator();
			    iter2.next();
			    iter2.remove();

			    equals(iter2.hasNext(), false);
			    equals(c.size(), 0);
		    },
		    
		    iteratorRemoveChangesContains : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[3] ]);

			    var iter = c.iterator();
			    var removed1 = iter.next();
			    iter.remove();

			    equals(c.contains(removed1), false);

			    iter.next();
			    var removed2 = iter.next();
			    iter.remove();

			    equals(c.contains(removed2), false);
			    equals(iter.hasNext(), false);

			    var iter2 = c.iterator();
			    var removed3 = iter2.next();
			    iter2.remove();

			    equals(c.contains(removed3), false);
			    equals(iter2.hasNext(), false);
		    },

		    clearChangesSize : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[2] ]);

			    c.clear();
			    equals(c.size(), 0);
		    },
		    
		    clearChangesContains : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1]]);

			    c.clear();
			    equals(c.contains(data[0]), false);
			    equals(c.contains(data[1]), false);
		    },

		    removeChangesSize : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[2] ]);
			    c.remove(data[1]);
			    equals(c.size(), 2);
		    },
		    
		    removeChangesContains : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1] ]);
			    c.remove(data[1]);
			    equals(c.contains(data[0]), true);
			    equals(c.contains(data[1]), false);
		    },

		    removeAllArray_All_ChangesSize : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1] ]);
			    var a = [ data[1], data[0] ];

			    c.removeAll(a);

			    equals(c.size(), 0);
		    },

		    removeAllArray_All_ChangesContains : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1] ]);
			    var a = [ data[1], data[0] ];

			    c.removeAll(a);

			    equals(c.contains(data[0]), false);
			    equals(c.contains(data[1]), false);
		    },

		    removeAllArray_Some_ChangesSize : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[2] ]);
			    var a = [ data[0], data[2] ];

			    c.removeAll(a);

			    equals(c.size(), 1);
		    },
		    
		    removeAllArray_Some_ChangesContains : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[2] ]);
			    var a = [ data[0], data[2] ];

			    c.removeAll(a);

			    equals(c.contains(data[0]), false);
			    equals(c.contains(data[1]), true);
			    equals(c.contains(data[2]), false);
		    },
		    
		    removeAllArray_Disjoint_DoesNotChangeSize: function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[2] ]);
			    var a = [ data[3], data[4] ];

			    c.removeAll(a);
			    equals(c.size(), 3);
		    },

		    removeAllArray_Disjoint_DoesNotChangeContains: function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[2] ]);
			    var a = [ data[3], data[4] ];

			    c.removeAll(a);
			    equals(c.contains(data[0]), true);
			    equals(c.contains(data[1]), true);
			    equals(c.contains(data[2]), true);
		    },
		    
		    removeAllArray_Nothing_DoesNotChangeSize: function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[2] ]);
			    var a = [];

			    c.removeAll(a);
			    equals(c.size(), 3);
		    },

		    removeAllArray_Nothing_DoesNotChangeContains: function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[2] ]);
			    var a = [];

			    c.removeAll(a);
			    equals(c.contains(data[0]), true);
			    equals(c.contains(data[1]), true);
			    equals(c.contains(data[2]), true);
		    },

		    retainAllArray : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[2] ]);
			    var a = [ data[0], data[2] ];

			    c.retainAll(a);

			    equals(c.size(), 2);
			    equals(c.contains(data[0]), true);
			    equals(c.contains(data[1]), false);
			    equals(c.contains(data[2]), true);
		    },

		    retainAllArrayNothing : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[2] ]);
			    var a = [ data[3], data[4] ];

			    c.retainAll(a);

			    equals(c.size(), 0);
			    equals(c.contains(data[0]), false);
			    equals(c.contains(data[1]), false);
			    equals(c.contains(data[2]), false);
		    },

		    retainAllArrayEverything : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1], data[2] ]);
			    var a = [ data[0], data[1], data[2] ];

			    c.retainAll(a);

			    equals(c.size(), 3);
			    equals(c.contains(data[0]), true);
			    equals(c.contains(data[1]), true);
			    equals(c.contains(data[2]), true);
		    }
		};
		tests = testUtil.extend(tests, removeTests);
	}

	if (options.add === true) {
		var addTests = {
		    addChangesIterator : function(constructorFunction) {
			    var c = constructorFunction();

			    c.add(data[1]);

			    var iter = c.iterator();
			    equals(iter.next(), data[1]);
			    equals(iter.hasNext(), false);

			    c.add(data[0]);
			    c.add(data[2]);

			    var iter2 = c.iterator();
			    iter2.next();
			    iter2.next();
			    iter2.next();
			    equals(iter2.hasNext(), false);
		    },

		    addChangesSize : function(constructorFunction) {
			    var c = constructorFunction();

			    c.add(data[1]);
			    equals(c.size(), 1);

			    c.add(data[0]);
			    c.add(data[2]);
			    equals(c.size(), 3);
		    },

		    addChangesContains : function(constructorFunction) {
			    var c = constructorFunction();

			    c.add(data[1]);
			    equals(c.contains(data[1]), true);

			    c.add(data[0]);
			    c.add(data[2]);
			    equals(c.contains(data[0]), true);
			    equals(c.contains(data[1]), true);
			    equals(c.contains(data[2]), true);
		    },

		    addReturnsTrueOnSuccess : function(constructorFunction) {
			    var c = constructorFunction();
			    var isSuccess = c.add(data[1]);
			    equals(isSuccess, true);
		    },

		    addAllIterable : function(constructorFunction) {
			    var c1 = constructorFunction( [ data[0], data[1] ]);
			    var c2 = constructorFunction( [ data[3], data[2] ]);

			    c1.addAll(c2);

			    equals(c1.contains(data[0]), true);
			    equals(c1.contains(data[1]), true);
			    equals(c1.contains(data[3]), true);
			    equals(c1.contains(data[2]), true);

			    equals(c2.contains(data[0]), false);
			    equals(c2.contains(data[1]), false);
			    equals(c2.contains(data[3]), true);
			    equals(c2.contains(data[2]), true);
		    },

		    addAllArray : function(constructorFunction) {
			    var c = constructorFunction( [ data[0], data[1] ]);
			    var a = [ data[2] ];

			    c.addAll(a);

			    equals(c.contains(data[0]), true);
			    equals(c.contains(data[1]), true);
			    equals(c.contains(data[2]), true);

			    equals(a.length, 1);
			    equals(a[0], data[2]);
		    }
		};
		tests = testUtil.extend(tests, addTests);
	}
	
	return tests;
};