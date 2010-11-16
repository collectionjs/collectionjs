/*global collectionjs */
(function(collectionjs, helper) {
	var create = helper.create;

	/**
	 * @class
	 * @augments collectionjs.protos.collection
	 * @augments collectionjs.interfaces.set
	 */
	collectionjs.protos.set = create(collectionjs.protos.collection);
	var setPrototype = collectionjs.protos.set;

	/**
	 * @class
	 * @augments collectionjs.protos.set
	 * @augments collectionjs.protos.modifiableCollection
	 */
	var modifiableSetPrototype = create(setPrototype);
	collectionjs.copyCollectionMethods(modifiableSetPrototype, {
	    all : false,
	    modify : true
	});

	/**
	 * 
	 */
	collectionjs.copySetMethods = function(object, options) {
		collectionjs.copyCollectionMethods(object, options);
	};

	/**
	 * 
	 */
	collectionjs.newAbstractSet = function(methods) {
		if (typeof methods.iterator !== 'function') {
			throw new Error('set requires iterator function');
		}
		if (typeof methods.size !== 'function') {
			throw new Error('set requires size function');
		}

		var iter = methods.iterator();
		var options = {
		    core : false,
		    extension : false,
		    add : (typeof methods.add === 'function'),
		    remove : (typeof iter.remove === 'function')
		};

		var newObject;
		if (options.add !== false && options.remove !== false) {
			newObject = create(modifiableSetPrototype, methods);
		}
		else {
			newObject = create(setPrototype, methods);
			collectionjs.copySetMethods(newObject, options);
		}

		return newObject;
	};

	/**
	 * 
	 */
	collectionjs.newSetFromMap = function(map) {
		if (!collectionjs.isMap(map)) {
			throw new Error(
			        'map is not a map (great error or the greatest error?)');
		}

		// This is the dummy value that will be used for every key in the
		// map. It doesn't really matter what it is as long as it isn't
		// undefined.
		var VALUE = {};

		var newSet = {
		    size : function() {
			    return map.size();
		    },
		    iterator : function() {
			    return map.mapIterator();
		    }, 
		    contains : function(obj) {
			    return map.containsKey(obj);
		    }
		};
		
		// If the map has a keySet then there may be more efficient
		// implementations of some methods so we'll use those
		if (typeof map.keySet === 'function') {
			newSet.iterator = function() {
				return map.keySet().iterator();
			};
			newSet.containsAll = function(iterableOrArray) {
				return map.keySet().containsAll(iterableOrArray);
			};
			newSet.toArray = function() {
				return map.keySet().toArray();
			};
		}

		if (typeof map.put === 'function') {
			newSet.add = function(obj) {
				var result = map.put(obj, VALUE);
				var isChanged = (typeof result === 'undefined');
				return isChanged;
			};
		}

		if (typeof map.remove === 'function') {
			newSet.remove = function(obj) {
				var result = map.remove(obj); 
				var isChanged = (typeof result === 'undefined');
				return isChanged;
			};
			newSet.clear = function(iterableOrArray, equalityComparer) {
				map.clear();
			};
			
			// If the map has a keySet then there may be more efficient
			// implementations of these methods
			if (typeof map.keySet === 'function') {
				newSet.removeAll = function(iterableOrArray, equalityComparer) {
					return map.keySet().removeAll(iterableOrArray, equalityComparer);
				};
				newSet.retainAll = function(iterableOrArray, equalityComparer) {
					return map.keySet().retainAll(iterableOrArray, equalityComparer);
				};
			}
		}

		return collectionjs.newAbstractSet(newSet);
	};

	// Add some set views to the map prototype

	/**
	 * Returns a set view of the keys in the map. Removing keys from this set
	 * will also remove them from the map.
	 */
	collectionjs.protos.map.keySet = function() {
		var createKeySetFunction = function() {
			var keySet = null;
			var keySetFunction = function() {
				if (keySet) {
					return keySet;
				}

				var map = this;
				keySet = {
				    size : function() {
					    return map.size();
				    },
				    iterator : function() {
					    var mapIter = map.mapIterator();
					    var iter = {
					        hasNext : function() {
						        return mapIter.hasNext();
					        },
					        next : function() {
						        return mapIter.next();
					        }
					    };
					    if (typeof mapIter.remove === 'function') {
						    iter.remove = function() {
						    	mapIter.remove();
						    };
					    }
					    return iter;
				    },
				    equalityComparer : function() {
					    return map.keyEqualityComparer();
				    }
				};

				keySet = collectionjs.newAbstractSet(keySet);
				return keySet;
			};

			return keySetFunction;
		};

		// Self-rewriting!
		this.keySet = createKeySetFunction();
		return this.keySet();
	};

	/**
	 * Returns a collection view of the values in the map. Removing values from
	 * the values collection will also remove them from the map.
	 */
	collectionjs.protos.map.values = function() {
		var createValuesFunction = function() {
			var values = null;
			var valuesFunction = function() {
				if (values) {
					return values;
				}

				var map = this;
				values = {
				    size : function() {
					    return map.size();
				    },
				    iterator : function() {
					    var mapIter = map.mapIterator();
					    var iter = {
					        hasNext : function() {
						        return mapIter.hasNext();
					        },
					        next : function() {
						        mapIter.next();
						        return mapIter.getValue();
					        }
					    };

					    if (typeof mapIter.remove === 'function') {
						    iter.remove = function() {
							    mapIter.remove();
						    };
					    }

					    return iter;
				    },
				    equalityComparer : function() {
					    return map.valueEqualityComparer();
				    }
				};
				values = collectionjs.newAbstractCollection(values);
				return values;
			};

			return valuesFunction;
		};

		// More self-rewriting!
		this.values = createValuesFunction();
		return this.values();
	};
}(collectionjs, collectionjs.__transporter__));