/*global collectionjs */

(function(collectionjs, transporter) {
	var create = transporter.create;
	var extend = transporter.extend;
	var normalizeCopyOptions = transporter.normalizeCopyOptions;
	var copyFunctionsAsNeeded = transporter.copyFunctionsAsNeeded;	
	var isArrayLike = transporter.isArrayLike;

	/**
	 * Returns true if the specified object contains all of the methods
	 * necessary to be a {@link collectionjs.interfaces.map} instance.
	 * 
	 * @param maybeMap
	 *            the object to check
	 * 
	 * @return {boolean} true if the specified object is a <code>map</code>
	 */
	collectionjs.isMap = function(maybeMap) {
		return collectionjs.isMapIterable(maybeMap) &&
		        typeof maybeMap.size === 'function' &&
		        typeof maybeMap.keyEqualityComparer === 'function' &&
		        typeof maybeMap.valueEqualityComparer === 'function' &&
		        typeof maybeMap.get === 'function' &&
		        typeof maybeMap.containsKey === 'function' &&
		        typeof maybeMap.containsValue === 'function';
	};

	/**
	 * Returns a map iterable created from the specified object. If the object
	 * is already a mapIterable, then it will be returned. If the object is an
	 * array, then a mapIterable will be created from it using
	 * {@link collectionjs.newMapIterableFromArray}. Otherwise an error will be
	 * thrown.
	 */
	var toMapIterable = function(mapIterableOrObject) {
		if (collectionjs.isMapIterable(mapIterableOrObject)) {
			return mapIterableOrObject;
		}
		else if (isArrayLike(mapIterableOrObject)) {
			return collectionjs.newMapIterableFromArray(mapIterableOrObject);
		}
		else {
			throw Error("Cannot convert <" + (typeof mapIterableOrObject) +
			        "> to a map iterable");
		}
	};

	var defaultEqualityComparer = collectionjs.newEqualityComparer();
	/**
	 * @class
	 * @augments collectionjs.protos.iterable
	 * @augments collectionjs.interfaces.map
	 */
	collectionjs.protos.map = create(collectionjs.protos.iterable, {
	    keyEqualityComparer : function() {
		    return defaultEqualityComparer;
	    },

	    valueEqualityComparer : function() {
		    return defaultEqualityComparer;
	    },

	    get : function(key) {
		    var equalityComparer = this.keyEqualityComparer();
		    var mapIter = this.mapIterator();
		    while (mapIter.hasNext()) {
			    var nextKey = mapIter.next();
			    if (equalityComparer.equals(key, nextKey)) {
				    return mapIter.getValue();
			    }
		    }
	    },

	    containsKey : function(key) {
	    	var equalityComparer = this.keyEqualityComparer();
	    	var mapIter = this.mapIterator();
		    while (mapIter.hasNext()) {
			    var nextKey = mapIter.next();
			    if (equalityComparer.equals(key, nextKey)) {
				    return true;
			    }
		    }
		    return false;
	    },

	    containsValue : function(value, valueEqualityComparer) {
		    var equalityComparer = this.valueEqualityComparer();
		    var mapIter = this.mapIterator();
		    while (mapIter.hasNext()) {
			    mapIter.next();
			    if (equalityComparer.equals(value, mapIter.getValue())) {
				    return true;
			    }
		    }
		    return false;
	    }
	});

	var mapPrototype = collectionjs.protos.map;
	var modifiableMapPrototype = create(collectionjs.protos.map, {
	    remove : function(key) {
		    if (typeof key === 'undefined') {
			    throw new ReferenceError('key');
		    }

		    var equalityComparer = this.keyEqualityComparer();
		    var mapIter = this.mapIterator();

		    var nextKey;
		    while (mapIter.hasNext()) {
			    nextKey = mapIter.next();
			    if (equalityComparer.equals(key, nextKey)) {
				    mapIter.remove();
				    return mapIter.getValue();
			    }
		    }
		    return undefined;
	    },

	    clear : function() {
		    var mapIter = this.mapIterator();
		    while (mapIter.hasNext()) {
		    	mapIter.next();
		    	mapIter.remove();
		    }
	    },
	    putAll : function(mapIterableOrObject) {
		    var mapIter = toMapIterable(mapIterableOrObject).mapIterator();
		    while (mapIter.hasNext()) {
			    var key = mapIter.next();
			    this.put(key, mapIter.getValue());
		    }
	    }
	});


	/**
	 * 
	 */
	collectionjs.copyMapMethods = function(destination, options) {
		options = normalizeCopyOptions(options, [ 'add', 'remove' ]);

		// Detect whether we need to copy any types of optional methods
		if (typeof options.add === 'undefined') {
			options.add = (typeof destination.add === 'function');
		}
		if (typeof options.remove === 'undefined') {
			if (typeof destination.iterator !== 'undefined') {
				var iter = destination.iterator();
				options.remove = (typeof iter.remove === 'function');
			}
		}

		var coreMethodNames = [ 'keyEqualityComparer', 'valueEqualityComparer',
		        'get', 'containsKey', 'containsValue' ];
		
		// There are a couple of prototype methods that can be added in set.js.
		if (typeof mapPrototype.keySet === 'function') {
			coreMethodNames.push('keySet');
		}
		if (typeof mapPrototype.values === 'function') {
			coreMethodNames.push('values');
		}

		var modifiableMethodNamesByType = {
		    put : [ 'putAll' ],
		    remove : [ 'clear', 'remove' ]
		};
		copyFunctionsAsNeeded(destination, mapPrototype,
		        modifiableMapPrototype, coreMethodNames,
		        modifiableMethodNamesByType, options);

	};

	/**
	 * <p>
	 * Returns a new object that implements the
	 * {@link collectionjs.interfaces.map} interface.
	 * </p>
	 * 
	 * <p>
	 * At a minimum, the <code>mapIterator</code> and <code>size</code>
	 * methods must be provided. For a modifiable map, the <code>add</code>
	 * method and the mapIterator's <code>remove</code> methods must be
	 * provided.
	 * </p>
	 * 
	 * @param methods
	 *            any methods to be included in the map; these will override any
	 *            default implementations
	 * 
	 * @return {collectionjs.interfaces.map} a map
	 */
	collectionjs.newAbstractMap = function(methods) {
		if (typeof methods.mapIterator !== 'function') {
			throw new Error('map requires mapIterator function');
		}
		if (typeof methods.size !== 'function') {
			throw new Error('map requires size function');
		}

		var mapIter = methods.mapIterator();
		var options = {
		    all : false,
		    add : (typeof methods.put === 'function'),
		    remove : (typeof mapIter.remove === 'function')
		};
		options.set = options.add;

		var newObject;
		if (options.add !== false && options.remove !== false) {
			newObject = create(modifiableMapPrototype, methods);
		}
		else {
			newObject = create(mapPrototype, methods);
			collectionjs.copyMapMethods(newObject, options);
		}

		return newObject;
	};

	/**
	 * 
	 */
	transporter.createMapIterableOptions = function(constructorArgs, defaultOptions) {
		var mapIterableOrArray = constructorArgs[0];
		var options = constructorArgs[1] || {};

		if (collectionjs.isMapIterable(mapIterableOrArray)) {
			options.mapIterable = mapIterableOrArray;
		}
		else if (isArrayLike(mapIterableOrArray)) {
			options.mapIterable = collectionjs.newMapIterableFromArray(mapIterableOrArray);
		}
		else if (typeof mapIterableOrArray === 'object' &&
				mapIterableOrArray !== null) {
			if (typeof constructorArgs[1] === 'undefined') {
				// If there is only one argument and it isn't an array or a
				// mapIterable then we'll assume that it's an options object
				// and shift our arguments
				options = mapIterableOrArray;
				mapIterableOrArray = undefined;
			}
		}
		else if (typeof mapIterableOrArray !== 'undefined') {
			// If the arguments are invalid then we must throw them away
			throw new Error("Invalid constructor argument <" +
			        (typeof constructorArgs[0]) + ">")
		}

		return extend( {}, defaultOptions, options);
	};
	
}(collectionjs, collectionjs.__transporter__));