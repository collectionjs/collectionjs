/*global collectionjs */

(function(collectionjs, transporter) {
	var create = transporter.create;
	var extend = transporter.extend;
	var isArrayLike = transporter.isArrayLike;

	/**
	 * Checks if the specified index is valid for a collection with the
	 * specified size.
	 * 
	 * @param index the index to check
	 * @param size the size of the collection
	 * @param isInclusive true if the check should be inclusive (the index can
	 *        be equal to the size) or exclusive (the index must be less than
	 *        the size)
	 */
	var checkIndex = function(index, size, isInclusive) {
		if (isInclusive === true) {
			size++;
		}

		var type = typeof index;
		if (type !== 'number') {
			throw new TypeError('expected <number> but was <' + type + '>');
		}

		// Make sure the index is an integer.
		// This won't work for integers greater than 2^32 - 1 but those
		// aren't valid indexes anyway so life is good.
		if (index !== index >> 0) {
			throw new TypeError('index <' + index + '> must be an integer');
		}

		// Make sure the index is in the valid range.
		if (index < 0) {
			throw new RangeError("index <" + index + "> cannot be negative");
		}
		if (index >= size) {
			var message;
			if (isInclusive) {
				message = "index <" + index + "> is greater than size <" +
				        (size - 1) + ">";
			}
			else {
				if (index === size) {
					message = "index <" + index + "> is equal to size <" +
					        size + ">";
				}
				else {
					message = "index <" + index + "> is greater than size <" +
					        size + ">";
				}
			}
			throw new RangeError(message);
		}

		// From the ECMA-262 spec:
		// A property name P (in the form of a String value) is an array
		// index
		// if and only if ToString(ToUint32(P)) is equal to P and
		// ToUint32(P) is
		// not equal to 2^32 - 1.

		// We could check that here if we really want to be safe, but it
		// would only cause a problem if someone actually had a list that
		// big so the list size check doesn't catch it and it gets through
		// our integer check that conveniently breaks for integers bigger
		// than this.
	};

	var checkIndexExclusive = function(index, size) {
		checkIndex(index, size, false);
	};

	var checkIndexInclusive = function(index, size) {
		checkIndex(index, size, true);
	};

	/**
	 * Returns true if the specified thing is an iterable object.
	 * 
	 * @param maybeIterable the thing to check
	 * @return {boolean} true if the thing is an iterable
	 */
	collectionjs.isIterable = function(maybeIterable) {
		return typeof maybeIterable === 'object' && maybeIterable !== null &&
		        typeof maybeIterable.iterator === 'function';
	};

	/**
	 * @class
	 * @augments collectionjs.interfaces.iterable
	 */
	collectionjs.protos.iterable =
	/** @lends collectionjs.protos.iterable.prototype */
	{
		toString : function() {
			var stringArray = [];

			var iter = this.iterator();
			while (iter.hasNext()) {
				var e = iter.next();
				stringArray.push(e.toString());
			}

			return '[' + stringArray.join(',') + ']';
		}
	};
	var iterablePrototype = collectionjs.protos.iterable;

	/**
	 * Copies methods as needed from the iterable prototype to the specified
	 * object based on the specified options. This will not overwrite any
	 * existing methods on the destination object.
	 * 
	 * @param destination the object to which to copy the iterable methods
	 * @param {collectionjs.interfaces.copyFunctionOptions} [options]
	 */
	collectionjs.copyIterableMethods = function(destination, options) {
		// We don't currently have any methods that we really need to copy
		// But this function still exists and is called so we can easily add
		// some extension methods in the future.
	};

	/**
	 * Creates and returns a new iterable object.
	 * 
	 * @param {Object. <Function>} methods the methods to include in the new
	 *        iterable
	 * @return {iterable} a new iterable that includes all of the specified
	 *         methods
	 * @throws {} If methods.iterator is not a function
	 * @throws {} If any of the the properties of the methods parameter are not
	 *         a function
	 */
	collectionjs.newAbstractIterable = function(methods) {
		if (typeof methods.iterator !== 'function') {
			throw new Error('iterable requires iterator function');
		}
		return create(iterablePrototype, methods);
	};

	/**
	 * Returns a new iterable object backed by the specified array. Changes to
	 * the array will affect the returned iterable and changes to the returned
	 * iterable will also affect the array.
	 * 
	 * @param {Array} array the array
	 * @return {collectionjs.interfaces.iterable} an iterable backed by the
	 *         array
	 */
	collectionjs.newIterableFromArray = function(array) {
		return collectionjs.newAbstractIterable({
			iterator : function() {
				var i = 0;
				var prev = -1;
				return {
				    hasNext : function() {
					    return i < array.length;
				    },
				    next : function() {
					    checkIndexExclusive(i, array.length);
					    prev = i;
					    return array[i++];
				    },
				    remove : function() {
					    if (prev < 0) {
						    throw new Error("There is nothing to remove.");
					    }

					    array.splice(prev, 1);
					    i = prev;
					    prev = -1;
				    }
				};
			}
		});
	};

	/**
	 * Returns an unmodifiable iterable object for the specified array. This
	 * will be a minimal implementation with no sanity checking and it will not
	 * include any optional methods (just hasNext and next).
	 */
	var createArrayIterable = function(array) {
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
	};

	/**
	 * Creates a standard options object for creating an iterable from the
	 * specified constructor arguments and the specified default options.
	 * 
	 * @param {Array} constructorArgs the arguments array from the constructor
	 *        function
	 * @param {Object} defaultOptions the default values for any options the
	 *        constructor requires
	 */
	transporter.createIterableOptions = function(constructorArgs,
	        defaultOptions) {
		var iterableOrArray = constructorArgs[0];
		var options = constructorArgs[1] || {};

		if (collectionjs.isIterable(iterableOrArray)) {
			options.iterable = iterableOrArray;
		}
		else if (isArrayLike(iterableOrArray)) {
			options.iterable = createArrayIterable(iterableOrArray);
		}
		else if (typeof iterableOrArray === 'object' &&
		        iterableOrArray !== null) {
			if (typeof constructorArgs[1] === 'undefined') {
				// If there is only one argument and it isn't an array or an
				// iterable then we'll assume that it's an options object
				// and shift our arguments accordingly
				options = iterableOrArray;
				iterableOrArray = undefined;
			}
		}
		else if (typeof iterableOrArray !== 'undefined') {
			// If the arguments are invalid then we must throw them away
			throw new Error("Invalid constructor argument <" +
			        (typeof constructorArgs[0]) + ">")
		}

		return extend( {}, defaultOptions, options);
	};


	/**
	 * Creates an iterable from the specified object. If the object is an
	 * iterable then it will be returned. If it is an array, then a new iterable
	 * will be created from the array and returned. Otherwise a TypeError will
	 * be thrown.
	 */
	transporter.toIterable = function(iterableOrArray) {
		if (typeof iterableOrArray === 'undefined') {
			throw new ReferenceError('iterableOrArray');
		}

		if (collectionjs.isIterable(iterableOrArray)) {
			return iterableOrArray;
		}
		else if (isArrayLike(iterableOrArray)) {
			return createArrayIterable(iterableOrArray);
		}
		else {
			throw new TypeError(
			        'iterableOrArray is not an iterable or an array');
		}
	};
	transporter.checkIndexExclusive = checkIndexExclusive;
	transporter.checkIndexInclusive = checkIndexInclusive;
}(collectionjs, collectionjs.__transporter__));