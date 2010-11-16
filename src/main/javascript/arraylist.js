/*global collectionjs */
(function(collectionjs, transporter) {
	var checkIndexExclusive = transporter.checkIndexExclusive;
	var checkIndexInclusive = transporter.checkIndexInclusive;
	var createCollectionOptions = transporter.createCollectionOptions;
	var isArrayLike = transporter.isArrayLike;
	
	// The isArray method was added to the ECMAScript specifications in the 5th
	// edition so not all browsers support it. So we'll use that if it's
	// available otherwise we'll default to our own implementation.
	var isArray;
	if (typeof Array.isArray === 'function') {
		isArray = Array.isArray;
	}
	else {
		isArray = function() {
			// This may not always detect an array (such as in a multi-frame
			// environment where the array was created in different frame), but
			// for the purposes we're using this for that shouldn't really
			// matter. The important thing is that it doesn't tell us that
			// something is an array when it isn't.
			return (this instanceof Array);
		};
	}

	// Returns an array representation of the specified object (if possible).
	// If the object is an array, then it will be returned. Otherwise a new
	// array will be constructed and filled from the object's values and that
	// will be returned.
	var toArray = function(iterableOrArray) {
		if (typeof iterableOrArray === 'undefined') {
			throw new ReferenceError('iterableOrArray');
		}

		var array;
		if (isArray.call(iterableOrArray)) {
			array = iterableOrArray;
		}
		else if (collectionjs.isIterable(iterableOrArray)) {
			array = [];

			var iter = iterableOrArray.iterator();
			while (iter.hasNext()) {
				var e = iter.next();
				array.push(e);
			}
			return array;
		}
		else if (isArrayLike(iterableOrArray)) {
			array = [];

			var length = iterableOrArray.length;
			for ( var i = 0; i < length; i++) {
				array.push(iterableOrArray[i]);
			}
		}
		else {
			throw new TypeError(
			        'iterableOrArray is not an iterable or an array');
		}

		return array;
	};

	// Creates a list object backed by the specified array.
	var createArrayList = function(array, equalityComparer) {
		var arrayList = {
		    size : function() {
			    return array.length;
		    },
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
		    },
		    equalityComparer : function() {
			    return equalityComparer;
		    },

		    toArray : function() {
			    return array.slice();
		    },

		    add : function(element) {
			    array.push(element);
			    return true;
		    },

		    addAll : function(iterableOrArray) {
			    var arrayToAdd = toArray(iterableOrArray);
			    this.addAllAt(array.length, arrayToAdd);
			    return arrayToAdd.length > 0;
		    },

		    addAt : function(index, element) {
			    checkIndexInclusive(index, array.length);
			    array.splice(index, 0, element);
		    },

		    addAllAt : function(index, iterableOrArray) {
			    checkIndexInclusive(index, array.length);

			    var arrayToAdd = toArray(iterableOrArray);

			    // Put all of the arguments into an array so we can use the
			    // splice function (you have to admit, this is pretty awesome)
			    var spliceArgs = [ index, 0 ];
			    spliceArgs = spliceArgs.concat(arrayToAdd);
			    Array.prototype.splice.apply(array, spliceArgs);
		    },

		    remove : function(element) {
			    var i = this.indexOf(element);
			    if (i < 0) {
				    return false;
			    }
			    array.splice(i, 1);
			    return true;
		    },

		    removeAt : function(index) {
			    checkIndexExclusive(index, array.length);

			    var element = array[index];
			    array.splice(index, 1);
			    return element;
		    },

		    clear : function() {
			    array.length = 0;
		    },

		    get : function(index) {
			    checkIndexExclusive(index, array.length);
			    return array[index];
		    },

		    set : function(index, element) {
			    checkIndexExclusive(index, array.length);
			    var oldElement = array[index];
			    array[index] = element;
			    return oldElement;
		    }
		};
		return collectionjs.newAbstractRandomAccessList(arrayList);
	};

	/**
	 * Returns a new <code>arrayList</code> object.
	 * 
	 * @param {collectionjs.interfaces.iterable|Array}
	 *            [iterableOrArray]
	 * @param [options]
	 */
	collectionjs.newArrayList = function() {
		var options = createCollectionOptions(arguments);

		var array;
		if (options.iterable) {
			array = toArray(options.iterable);
		}
		else {
			array = [];
		}

		return createArrayList(array, options.equalityComparer);
	};

	/**
	 * Returns a new list backed by the specified array. Any changes make
	 * directly to the array will also change the returned list and any changes
	 * made to the returned list will change the array.
	 * 
	 * @param {Array}
	 *            array the array that backs this list
	 * @param [options]
	 */
	collectionjs.newListFromArray = function(array, options) {
		if (!collectionjs.isArrayLike(array)) {
			throw new Error("array is not valid")
		}

		if (typeof options === 'undefined') {
			options = {};
		}
		var equalityComparer;
		if (options.equalityComparer) {
			equalityComparer = options.equalityComparer;
			if (!collectionjs.isEqualityComparer(equalityComparer)) {
				throw new Error(
				        "options.equalityComparer is not a valid equality comparer");
			}
		}
		else {
			equalityComparer = collectionjs.newEqualityComparer();
		}

		return createArrayList(array, equalityComparer);
	};
}(collectionjs, collectionjs.__transporter__));