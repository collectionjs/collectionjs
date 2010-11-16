var createMapTests = function(options) {
	var defaultOptions = {
	    data : [ testUtil.createEntry(1, "one"), 
	             testUtil.createEntry(2, "two"), 
	             testUtil.createEntry(3, "three"), 
	             testUtil.createEntry(4, "four"), 
	             testUtil.createEntry(5, "five")], 
	    elementComparer : function(a, b) {
			// String compare because all keys in an objectMap are converted to
			// strings
			return a.key.toString() === b.key.toString();
		}
	};
	options = testUtil.extend(defaultOptions, options);

	var data = options.data;
	var testEntryData = options.data;
	var entryComparer = options.elementComparer;
	var elementEquals = function(actual, expected, message) {
		return testUtil.equalsUsingComparer(elementComparer, actual, expected,
		        message);
	};
	
	testUtil.entriesToMapIterable = function(array) {
		var mapIterable = {
			mapIterator : function() {
				var iter = testUtil.toIterable(array).iterator();
				var lastReturnedEntry;
				return {
				    hasNext : function() {
					    return iter.hasNext();
				    },
				    next : function() {
					    lastReturnedEntry = iter.next();
					    return lastReturnedEntry.key;
				    },
				    getKey : function() {
					    return lastReturnedEntry.key;
				    },
				    getValue : function() {
					    return lastReturnedEntry.value;
				    }
				};
			}
		};
		return mapIterable;
	};

	testUtil.entriesToMapObject = function(array) {
		var obj = {};
		var entry;
		
		var iter = testUtil.toIterable(array).iterator();
		while (iter.hasNext()) {
			entry = iter.next();
			obj[entry.key] = entry.value;
		}
		return obj;
	};
	

	// Normal map tests
	var mapOptions = {
	    data : testEntryData,
	    elementComparer : entryComparer
	};
	var tests = {
	    isMapTrueForMap : function(constructorFunction) {
		    var map = constructorFunction();
		    equals(collectionjs.isMap(map), true);
	    },

	    sizeWhenEmptyIsZero : function(constructorFunction) {
		    var map = constructorFunction();
		    equals(map.size(), 0);
	    },

	    sizeWhenNotEmpty : function(constructorFunction) {
		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0], data[1], data[2] ]));
		    equals(map.size(), 3);
	    },

	    getWhenKey : function(constructorFunction) {
		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0] ]));
		    var key = data[0].key;
		    var value = data[0].value;
		    equals(map.get(key), value);
	    },

	    getWhenNoKey : function(constructorFunction) {
		    var map = constructorFunction();
		    var key = data[0].key;
		    equals(map.get(key), undefined);
	    },

	    containsKeyWhenEmpty : function(constructorFunction) {
		    var map = constructorFunction();
		    equals(map.containsKey(data[0].key), false);
	    },

	    containsKeyWhenTrue : function(constructorFunction) {
		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0] ]));
		    equals(map.containsKey(data[0].key), true);
	    },

	    containsKeyWhenEmpty : function(constructorFunction) {
		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0] ]));
		    equals(map.containsKey(data[1].key), false);
	    },

	    containsValueWhenEmpty : function(constructorFunction) {
		    var map = constructorFunction();
		    equals(map.containsValue(data[0].value), false);
	    },

	    containsValueWhenTrue : function(constructorFunction) {
		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0] ]));
		    equals(map.containsValue(data[0].value), true);
	    },

	    containsValueWhenFalse : function(constructorFunction) {
		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0] ]));
		    equals(map.containsValue(data[1].value), false);
	    },

	    entrySetTwiceReturnsSameObject : function(constructorFunction) {
		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0] ]));
		    var s1 = map.entrySet();
		    var s2 = map.entrySet();
		    ok(s1 === s2);
	    },
	    keysTwiceReturnsSameObject : function(constructorFunction) {
		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0] ]));
		    var s1 = map.keySet();
		    var s2 = map.keySet();
		    ok(s1 === s2);
	    },
	    valuesTwiceReturnsSameObject : function(constructorFunction) {
		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0] ]));
		    var c1 = map.values();
		    var c2 = map.values();
		    ok(c1 === c2);
	    }
	};

	var modifiableTests = {
	    putNewKeyReturnsUndefined : function(constructorFunction) {
		    if (typeof constructorFunction().put !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }
		    var map = constructorFunction();
		    var key = data[0].key;
		    var value = data[0].value;

		    equals(map.put(key, value), undefined);
	    },

	    putExistingKeyReturnsOldValue : function(constructorFunction) {
		    if (typeof constructorFunction().put !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }
		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0] ]));
		    var key = data[0].key;
		    var oldValue = data[0].value;
		    var newValue = data[1].value;

		    equals(map.put(key, newValue), oldValue);
	    },

	    putThenGet : function(constructorFunction) {
		    if (typeof constructorFunction().put !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction();
		    var key = data[0].key;
		    var value = data[0].value;

		    equals(map.get(key), undefined);
		    map.put(key, value);
		    equals(map.get(key), value);
	    },

	    putThenContainsKey : function(constructorFunction) {
		    if (typeof constructorFunction().put !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction();
		    var key = data[0].key;
		    var value = data[0].value;

		    equals(map.containsKey(key), false);
		    map.put(key, value);
		    equals(map.containsKey(key), true);
	    },

	    putThenContainsValue : function(constructorFunction) {
		    if (typeof constructorFunction().put !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction();
		    var key = data[0].key;
		    var value = data[0].value;

		    equals(map.containsValue(value), false);
		    map.put(key, value);
		    equals(map.containsValue(value), true);
	    },

	    // TODO: an object always has string keys so this doesn't work in general
//	    putAllObjectThenGetWorksForAll : function(constructorFunction) {
//		    if (typeof constructorFunction().putAll !== 'function'
//		            && typeof constructorFunction().put !== 'function') {
//			    ok(true, "not tested because this is an optional method");
//			    return;
//		    }
//
//		    var map = constructorFunction();
//
//		    var iterable = testUtil.entriesToMapObject( [ data[0], data[1], data[2] ]);
//		    map.putAll(iterable);
//
//		    equals(map.size(), 3);
//		    equals(map.get(data[0].key), data[0].value);
//		    equals(map.get(data[1].key), data[1].value);
//		    equals(map.get(data[2].key), data[2].value);
//	    },

	    putAllMapIterableThenGetWorksForAll : function(constructorFunction) {
		    if (typeof constructorFunction().putAll !== 'function'
		            && typeof constructorFunction().put !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction();

		    var mapData = constructorFunction(testUtil.entriesToMapIterable( [ data[0], data[1], data[2] ]));
		    map.putAll(mapData);

		    equals(map.size(), 3);
		    equals(map.get(data[0].key), data[0].value);
		    equals(map.get(data[1].key), data[1].value);
		    equals(map.get(data[2].key), data[2].value);
	    },

	    putAllObjectHandlesDuplicates : function(constructorFunction) {
		    if (typeof constructorFunction().putAll !== 'function'
		            && typeof constructorFunction().put !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[2], data[1] ]));
		    map.putAll( testUtil.entriesToMapIterable([ data[0], data[1], data[2] ]));

		    equals(map.size(), 3);
		    equals(map.get(data[0].key), data[0].value);
		    equals(map.get(data[1].key), data[1].value);
		    equals(map.get(data[2].key), data[2].value);
	    },

	    removeOnEmptyMapDoesNothing : function(constructorFunction) {
		    if (typeof constructorFunction().remove !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction();
		    var key = data[0].key;
		    equals(map.remove(key), undefined);
	    },

	    removeOnlyElement : function(constructorFunction) {
		    if (typeof constructorFunction().remove !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0] ]));
		    var key = data[0].key;
		    var value = data[0].value;

		    equals(map.remove(key), value);
		    equals(map.mapIterator().hasNext(), false);
		    equals(map.size(), 0);
		    equals(map.get(key), undefined);
	    },
	    
	    removeFirstElement : function(constructorFunction) {
		    if (typeof constructorFunction().remove !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0], data[1], data[2] ]));
		    var key = data[0].key;
		    var value = data[0].value;
		    equals(map.remove(key), value);
		    
		    equals(map.size(), 2);
		    
		    equals(map.get(data[0].key), undefined);
		    equals(map.get(data[1].key), data[1].value);
		    equals(map.get(data[2].key), data[2].value);
		    
		    equals(map.containsKey(data[0].key), false);
		    equals(map.containsKey(data[1].key), true);
		    equals(map.containsKey(data[2].key), true);

		    var iter = map.mapIterator();
		    equals(iter.hasNext(), true);
		    iter.next();
		    equals(iter.hasNext(), true);
		    iter.next();
		    equals(iter.hasNext(), false);
	    },
	    
	    removeMiddleElement : function(constructorFunction) {
		    if (typeof constructorFunction().remove !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0], data[1], data[2] ]));
		    var key = data[1].key;
		    var value = data[1].value;
		    equals(map.remove(key), value);
		    
		    equals(map.size(), 2);
		    
		    equals(map.get(data[0].key), data[0].value);
		    equals(map.get(data[1].key), undefined);
		    equals(map.get(data[2].key), data[2].value);
		    
		    equals(map.containsKey(data[0].key), true);
		    equals(map.containsKey(data[1].key), false);
		    equals(map.containsKey(data[2].key), true);

		    var iter = map.mapIterator();
		    equals(iter.hasNext(), true);
		    iter.next();
		    equals(iter.hasNext(), true);
		    iter.next();
		    equals(iter.hasNext(), false);
	    },
	    
	    removeLastElement : function(constructorFunction) {
		    if (typeof constructorFunction().remove !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0], data[1], data[2] ]));
		    var key = data[2].key;
		    var value = data[2].value;
		    equals(map.remove(key), value);
		    
		    equals(map.size(), 2);
		    
		    equals(map.get(data[0].key), data[0].value);
		    equals(map.get(data[1].key), data[1].value);
		    equals(map.get(data[2].key), undefined);
		    
		    equals(map.containsKey(data[0].key), true);
		    equals(map.containsKey(data[1].key), true);
		    equals(map.containsKey(data[2].key), false);

		    var iter = map.mapIterator();
		    equals(iter.hasNext(), true);
		    iter.next();
		    equals(iter.hasNext(), true);
		    iter.next();
		    equals(iter.hasNext(), false);
	    },
	    
	    removeMultipleElements : function(constructorFunction) {
		    if (typeof constructorFunction().remove !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0], data[1], data[2] ]));
		    var key;
		    var value;
		    
		    key = data[2].key;
		    value = data[2].value;
		    equals(map.remove(key), value);
		    
		    equals(map.size(), 2);

		    equals(map.get(data[0].key), data[0].value);
		    equals(map.get(data[1].key), data[1].value);
		    equals(map.get(data[2].key), undefined);
		    
		    equals(map.containsKey(data[0].key), true);
		    equals(map.containsKey(data[1].key), true);
		    equals(map.containsKey(data[2].key), false);
		   

		    key = data[0].key;
		    value = data[0].value;
		    equals(map.remove(key), value);
		    
		    equals(map.size(), 1);
		    
		    equals(map.get(data[0].key), undefined);
		    equals(map.get(data[1].key), data[1].value);
		    
		    equals(map.containsKey(data[0].key), false);
		    equals(map.containsKey(data[1].key), true);

		    key = data[1].key;
		    value = data[1].value;
		    equals(map.remove(key), value);
		    
		    equals(map.size(), 0);
		    equals(map.get(data[1].key), undefined);
		    equals(map.containsKey(data[1].key), false);
	    },

	    iteratorRemoveOnlyElement : function(constructorFunction) {
		    if (typeof constructorFunction().remove !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0] ]));

		    var iter = map.mapIterator();
		    iter.next();
		    iter.remove();
		    
		    equals(map.size(), 0);
		    equals(map.mapIterator().hasNext(), false);
		    equals(map.get(data[0].key, undefined));
	    },
	    
	    iteratorRemoveMultipleElements : function(constructorFunction) {
		    if (typeof constructorFunction().remove !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0], data[1], data[2] ]));
		    var iter;
		    
		    iter = map.mapIterator();
		    iter.next();
		    iter.next();
		    iter.next();
		    iter.remove();
		    
		    equals(map.size(), 2);
		    
		    equals(map.get(data[0].key), data[0].value);
		    equals(map.get(data[1].key), data[1].value);
		    equals(map.get(data[2].key), undefined);
		    
		    equals(map.containsKey(data[0].key), true);
		    equals(map.containsKey(data[1].key), true);
		    equals(map.containsKey(data[2].key), false);
		    
		    
		    iter = map.mapIterator();
		    iter.next();
		    iter.remove();
		    
		    equals(map.size(), 1);
		    
		    equals(map.get(data[0].key), undefined);
		    equals(map.get(data[1].key), data[1].value);

		    equals(map.containsKey(data[0].key), false);
		    equals(map.containsKey(data[1].key), true);
		    
		    iter = map.mapIterator();
		    iter.next();
		    iter.remove();
		    
		    equals(map.size(), 0);
		    equals(map.get(data[1].key), undefined);
		    equals(map.containsKey(data[1].key), false);
	    },

	    clearEmptyMapDoesNothing : function(constructorFunction) {
		    if (typeof constructorFunction().clear !== 'function'
		            && typeof constructorFunction().remove !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction();
		    map.clear();
		    equals(map.size(), 0);
	    },

	    clearWithStuff : function(constructorFunction) {
		    if (typeof constructorFunction().clear !== 'function'
		            && typeof constructorFunction().remove !== 'function') {
			    ok(true, "not tested because this is an optional method");
			    return;
		    }

		    var map = constructorFunction(testUtil.entriesToMapIterable( [ data[0], data[1], data[2] ]));
		    equals(map.size(), 3);
		    map.clear();
		    equals(map.size(), 0);
	    }
	};

	// KeySet tests
	var keySetTests = {};
	var createKeySetCallback = function(prefix) {
		 return function(key, testFunction) {
		 	var keySetTestFunction = function(mapConstructorFunction) {
				var constructor = function(iterableOrArray, options) {
					// Convert the key data to entries to pass into the map constructor
					// The values don't really matter since they won't be used.
					var object;
					if (iterableOrArray !== undefined) {
						var iter = testUtil.toIterable(iterableOrArray).iterator();
						var newArray = [];
						while (iter.hasNext()) {
							var key = iter.next();
							var e = testUtil.createEntry(key, "value");
							newArray.push(e);
						}
						object = testUtil.entriesToMapIterable(newArray);
					}

					return mapConstructorFunction(object, options).keySet();
				};
				testFunction(constructor);
			};
			keySetTests[prefix + " " + key] = keySetTestFunction;
	    };
	};
	
	var testKeyData = [];
	for ( var i = 0; i < testEntryData.length; i++) {
		testKeyData.push(testEntryData[i].key.toString());
	}

	var keySetOptions = {
		data: testKeyData,
		add: false
	};
	testUtil.each(createIterableConstructorTests(keySetOptions), createKeySetCallback("keySet constructor"));
	testUtil.each(createIterableTests(keySetOptions), createKeySetCallback("keySet iterable"));
	testUtil.each(createCollectionTests(keySetOptions), createKeySetCallback("keySet collection"));
	testUtil.each(createSetTests(keySetOptions), createKeySetCallback("keySet set"));

	
	// Values tests
	var valuesTests = {};
	var createValuesCallback = function(prefix) {
		 return function(key, testFunction) {
		 	var valuesTestFunction = function(mapConstructorFunction) {
				var constructor = function(iterableOrArray, options) {
					// Convert the value data to entries to pass into the map constructor.
					// The keys don't really matter as long as they are all unique.
					var object;
					if (iterableOrArray !== undefined) {
						var iter = testUtil.toIterable(iterableOrArray).iterator();
						var newArray = [];
						var i = 0;
						while (iter.hasNext()) {
							var value = iter.next();
							var e = testUtil.createEntry((++i).toString(), value);
							newArray.push(e);
						}
						object = testUtil.entriesToMapIterable(newArray);
					}

					return mapConstructorFunction(object, options).values();
				};
				testFunction(constructor);
			};
			valuesTests[prefix + " " + key] = valuesTestFunction;
	    };
	};
	
	var testValueData = [];
	for ( var i = 0; i < testEntryData.length; i++) {
		testValueData.push(testEntryData[i].value);
	}

	var valuesOptions = {
	    data : testValueData,
	    add : false
	};
	testUtil.each(createIterableConstructorTests(valuesOptions), createValuesCallback("values constructor"));
	testUtil.each(createIterableTests(valuesOptions), createValuesCallback("values iterable"));
	testUtil.each(createCollectionTests(valuesOptions), createValuesCallback("values collection"));

	return testUtil.extend(tests, modifiableTests, entrySetTests, keySetTests, valuesTests);
};