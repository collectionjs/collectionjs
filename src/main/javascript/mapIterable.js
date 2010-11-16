/*global collectionjs */

(function(collectionjs, transporter) {
	var isArrayLike = transporter.isArrayLike;
	
	/**
	 * Returns true if the specified object contains all of the methods
	 * necessary to be a {@link collectionjs.interfaces.mapIterable} instance.
	 * 
	 * @param maybeMapIterable
	 *            the object to check
	 * 
	 * @return {boolean} true if the specified object is a
	 *         <code>mapIterable</code>
	 */
	collectionjs.isMapIterable = function(maybeMapIterable) {
		return typeof maybeMapIterable === 'object' &&
		        maybeMapIterable !== null &&
		        typeof maybeMapIterable.mapIterator === 'function';
	};

	/**
	 * @class
	 * @augments collectionjs.interfaces.mapIterable
	 */
	collectionjs.protos.mapIterable = {
		/**
		 * Returns a string representation of the map. The exact format of the
		 * string is not guaranteed and may change in future implementations.
		 * 
		 * @return {string} a string representation of the map
		 */
		toString : function() {
			var stringArray = [];

			var mapIter = this.mapIterator();
			while (mapIter.hasNext()) {
				var key = mapIter.next();
				stringArray.push(key + ": " + mapIter.getValue());
			}

			return '{' + stringArray.join(',') + '}';
		}
	};
	var mapIterablePrototype = collectionjs.protos.mapIterable;

	/**
	 * Copies default mapIterable methods to the specified object as needed.
	 * This will not overwrite any functions that already exist (although it may
	 * overwrite non-function properties that are required by the mapIterable
	 * interface).
	 * 
	 * @param {Object} object the object to which to copy mapIterable methods
	 * @param {collectionjs.interfaces.copyFunctionOptions} [options] any
	 *        options to control which methods are copied
	 */
	collectionjs.copyMapIterableMethods = function(object, options) {
		// We don't currently have any methods to copy so right now this is only
		// provided as a place where we can add methods in the future.
	};

	/**
	 * Constructs and returns a new implementation of the mapIterable interface
	 * using the specified methods and default implementations of any methods
	 * not provided. At a minimum the <code>mapIterator</code> method must be
	 * provided.
	 * 
	 * @param {object} methods the methods to use in creating the new
	 *        mapIterable
	 * @return {collectionjs.interfaces.mapIterable} a new mapIterable
	 */
	collectionjs.newAbstractMapIterable = function(methods) {
		if (typeof methods.mapIterator !== 'function') {
			throw new Error('mapIterable requires mapIterator function');
		}
		
		// We could add our own methods here but we don't have any yet so why bother
		return create(mapIterablePrototype, methods);
	};

	/**
	 * Collects and returns all of the keys for the properties of the given
	 * object.
	 * 
	 * @param {Object} the object from which to get the keys
	 * @returns {Array<string>} the keys in the object
	 */
	var collectKeys = function(obj) {
		var keyArray = [];

		var key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				keyArray.push(key);
			}
		}
		return keyArray;
	};

	/**
	 * Returns a new mapIterable backed by the specified object. There will be
	 * one mapping in the mapIterable for each property in the object.
	 * Modifications to the object will affect the mapIterable and vice versa,
	 * but changes to the object in the middle of an iteration is undefined.
	 * 
	 * @param {Object} obj the object
	 * @return {collectionjs.iterfaces.mapIterable} a mapIterable backed by the
	 *         object
	 */
	collectionjs.newMapIterableFromObject = function(obj) {
		if (typeof obj != 'object') {
			throw Error("Cannot convert <" + (typeof obj) +
			        "> to a map iterable");
		}
		else if (obj === null) {
			throw Error("Cannot convert null to a map iterable");
		}
		
		// TODO: add a version that uses the javascript 1.7 Iterator (currently
		// Firefox only) that's used if the Iterator function exists.

		var keys = collectKeys(obj);
		return {
			mapIterator : function() {
				var i = 0;
				return {
				    hasNext : function() {
					    return i < keys.length;
				    },
				    next : function() {
					    return keys[i++];
				    },
				    getKey : function() {
					    return keys[i - 1];
				    },
				    getValue : function() {
					    return obj[keys[i - 1]];
				    }
				};
			}
		};
	};
	
	/**
	 * Creates and returns a new mapIterable backed by the specified array. Each
	 * element in the array must be another array with exactly two elements: a
	 * key and a value. Example:
	 * <code>[["key1", "value1"], ["key2", "value2"]]</code>.
	 * <p>
	 * Modifications to the array will affect the mapIterable and vice versa,
	 * but changes to the array in the middle of an iteration is undefined.
	 * 
	 * @param {Array} the array to back the mapIterable
	 * @return {collectionjs.iterfaces.mapIterable} a mapIterable backed by the
	 *         array
	 */
	collectionjs.newMapIterableFromArray = function(array) {
		if (!isArrayLike(array)) {
			throw Error("Cannot convert <" + (typeof array) +
			        "> to a map iterable");
		}

		return {
			mapIterator : function() {
				var i = 0;
				return {
				    hasNext : function() {
					    return i < array.length;
				    },
				    next : function() {
					    return array[i++][0];
				    },
				    getKey : function() {
					    return array[i - 1][0];
				    },
				    getValue : function() {
					    return array[keys[i - 1][1]];
				    }
				};
			}
		};
	};
}(collectionjs, collectionjs.__transporter__));