/*global collectionjs */

(function(collectionjs, transporter) {
	var toIterable = transporter.toIterable;
	var create = transporter.create;
	var normalizeCopyOptions = transporter.normalizeCopyOptions;
	var copyFunctionsAsNeeded = transporter.copyFunctionsAsNeeded;

	/**
	 * Returns true if the specified object has all of the functions required to
	 * be a collection.
	 * 
	 * @param maybeCollection the object to check
	 * @return {boolean} true if the object is a collection
	 */
	collectionjs.isCollection = function(maybeCollection) {
		return collectionjs.isIterable(maybeCollection) &&
		        typeof maybeCollection.size === 'function' &&
		        typeof maybeCollection.toArray === 'function' &&
		        typeof maybeCollection.contains === 'function' &&
		        typeof maybeCollection.containsAll === 'function' &&
		        typeof maybeCollection.equalityComparer === 'function';
	};

	var defaultEqualityComparer = collectionjs.newEqualityComparer();

	/**
	 * @class A prototype for collection objects. This may include both core
	 *        methods and extension methods but it should not contain any
	 *        modification methods.
	 * @augments collectionjs.protos.iterable
	 * @augments collectionjs.interfaces.collection
	 */
	collectionjs.protos.collection = create(collectionjs.protos.iterable,
	/** @lends collectionjs.protos.collection# */
	{
	    /**
		 * This implementation returns a default equality comparer. The returned
		 * instance will be the same each time this method is called and it may
		 * also be the same between different collection objects.
		 */
	    equalityComparer : function() {
		    return defaultEqualityComparer;
	    },

	    /**
		 * This implementation returns <code>size() == 0</code>.
		 */
	    isEmpty : function() {
		    return this.size() == 0;
	    },

	    /**
		 * This implementation iterates over the the elements in this collection
		 * until it finds an element that is equal to the specified element or
		 * there are no more elements to check. Equality is defined by the
		 * <code>equals</code> method in
		 * {@link collectionjs.protos.collection#equalityComparer}.
		 */
	    contains : function(element) {
		    if (typeof element === 'undefined') {
			    throw new ReferenceError('element');
		    }

		    var iter = this.iterator();
		    var equalityComparer = this.equalityComparer();
		    while (iter.hasNext()) {
			    var nextElement = iter.next();
			    if (equalityComparer.equals(element, nextElement) === true) {
				    return true;
			    }
		    }

		    return false;
	    },

	    /**
		 * This implementation iterates over the the elements in this collection
		 * until it finds elements that are equal to all of the specified
		 * elements or there are no more elements to check. Equality is defined
		 * by the <code>equals</code> method in
		 * {@link collectionjs.protos.collection#equalityComparer}.
		 */
	    containsAll : function(iterableOrArray) {
		    var iterable = toIterable(iterableOrArray);
		    var iter = iterable.iterator();
		    var equalityComparer = this.equalityComparer();
		    while (iter.hasNext()) {
			    var e = iter.next();
			    if (!this.contains(e, equalityComparer)) {
				    return false;
			    }
		    }

		    return true;
	    },

	    /**
		 * This implementation iterates over all of the elements in this
		 * collection and adds them to a new array in the same order as returned
		 * by the iterator.
		 */
	    toArray : function() {
		    var array = [];

		    var iter = this.iterator();
		    while (iter.hasNext()) {
			    var e = iter.next();
			    array.push(e);
		    }

		    return array;
	    }
	});
	var collectionPrototype = collectionjs.protos.collection;

	/**
	 * A collection prototype that includes all of the modification methods.
	 */
	var modifiableCollectionPrototype = create(
	        collectionjs.protos.collection,
	        {
	            /**
				 * This implementation iterates over each item in the specified
				 * collection and adds each one using
				 * {@link collectionjs.interfaces.collection#add}.
				 */
	            addAll : function(iterableOrArray) {
		            var iterable = toIterable(iterableOrArray);
		            var isChanged = false;

		            var iter = iterable.iterator();
		            while (iter.hasNext()) {
			            if (this.add(iter.next())) {
				            isChanged = true;
			            }
		            }

		            return isChanged;
	            },

	            /**
				 * This implementation iterates over each element in this
				 * collection and calls
				 * {@link collectionjs.interfaces.iterator#remove} for each one.
				 * Most collections will probably have a more efficient way to
				 * do this, so in most cases it is recommended to override this.
				 */
	            clear : function() {
		            var iter = this.iterator();
		            while (iter.hasNext()) {
			            iter.next();
			            iter.remove();
		            }
	            },

	            /**
				 * This implementation iterates through each element in this
				 * collection until it finds the element or there are no more
				 * elements to check. If the element is found, then it will be
				 * removed using {@link collectionjs.interfaces.iterator#remove}.
				 */
	            remove : function(element) {
		            if (typeof element === 'undefined') {
			            throw new ReferenceError('element');
		            }
		            var equalityComparer = this.equalityComparer();

		            var iter = this.iterator();
		            while (iter.hasNext()) {
			            var nextElement = iter.next();
			            if (equalityComparer.equals(element, nextElement) === true) {
				            iter.remove();
				            return true;
			            }
		            }

		            return false;
	            },

	            /**
				 * This implementation iterates over all of the elements in this
				 * collection, and for each element it searches for a matching
				 * element in the specified collection. If a match is found then
				 * the element is removed from this collection using
				 * {@link collectionjs.interfaces.iterator#remove}.
				 */
	            removeAll : function(iterableOrArray) {
		            var iterable = toIterable(iterableOrArray);
		            var equalityComparer = this.equalityComparer();

		            var isChanged = false;
		            var iter = this.iterator();
		            while (iter.hasNext()) {
			            var element = iter.next();

			            var otherIter = iterable.iterator();
			            while (otherIter.hasNext()) {
				            var otherElement = otherIter.next();
				            if (equalityComparer.equals(element, otherElement) === true) {
					            iter.remove();
					            isChanged = true;
					            break;
				            }
			            }
		            }

		            return isChanged;
	            },

	            /**
				 * This implementation iterates over all of the elements in this
				 * collection, and for each element it searches for a matching
				 * element in the specified collection. If a match is not found
				 * then the element is removed from this collection using
				 * {@link collectionjs.interfaces.iterator#remove}.
				 */
	            retainAll : function(iterableOrArray) {
		            var iterable = toIterable(iterableOrArray);
		            var equalityComparer = this.equalityComparer();

		            var isChanged = false;
		            var iter = this.iterator();
		            while (iter.hasNext()) {
			            var element = iter.next();

			            var isContained = false;
			            var otherIter = iterable.iterator();
			            while (otherIter.hasNext()) {
				            var otherElement = otherIter.next();
				            if (equalityComparer.equals(element, otherElement) === true) {
					            isContained = true;
					            break;
				            }
			            }

			            if (!isContained) {
				            iter.remove();
				            isChanged = true;
			            }
		            }

		            return isChanged;
	            }
	        });
	/**
	 * Copies methods from the collection prototype to the specified desintation
	 * object as needed using the specified options. This will not overwrite any
	 * functions that already exist on the destination object.
	 * 
	 * @param destination the object to which to copy the collection methods
	 * @param {collectionjs.interfaces.copyFunctionOptions} [options]
	 */
	collectionjs.copyCollectionMethods = function(destination, options) {
		options = normalizeCopyOptions(options, [ 'add', 'remove' ]);

		// If not specified in the options, detect whether we need to copy 
		// any types of modify methods
		if (typeof options.add === 'undefined') {
			options.add = (typeof destination.add === 'function');
		}
		if (typeof options.remove === 'undefined') {
			if (typeof destination.iterator !== 'undefined') {
				var iter = destination.iterator();
				options.remove = (typeof iter.remove === 'function');
			}
		}

		var coreMethodNames = [ 'equalityComparer', 'contains', 'containsAll',
		        'toArray' ];
		var modifiableMethodNamesByType = {
		    add : [ 'addAll' ],
		    remove : [ 'clear', 'remove', 'removeAll', 'retainAll' ]
		};

		copyFunctionsAsNeeded(destination, collectionPrototype,
		        modifiableCollectionPrototype, coreMethodNames,
		        modifiableMethodNamesByType, options);
		collectionjs.copyIterableMethods(destination, options);
	};

	/**
	 * Creates and returns a new collection object using the specified methods.
	 * At a minimum these methods must include <code>iterator</code> and
	 * <code>size</code>.
	 * 
	 * @param {Object.<Function>} methods the collection methods
	 */
	collectionjs.newAbstractCollection = function(methods) {
		if (typeof methods.iterator !== 'function') {
			throw new Error('collection requires iterator function');
		}
		if (typeof methods.size !== 'function') {
			throw new Error('collection requires size function');
		}

		var iter = methods.iterator();
		var options = {
		    all : false,
		    add : (typeof methods.add === 'function'),
		    remove : (typeof iter.remove === 'function')
		};

		var newObject;
		if (options.add !== false && options.remove !== false) {
			newObject = create(modifiableCollectionPrototype, methods);
		}
		else {
			newObject = create(collectionPrototype, methods);
			collectionjs.copyCollectionMethods(newObject, options);
		}

		return newObject;
	};

	var createIterableOptions = transporter.createIterableOptions;

	/**
	 * Creates a standard options object for creating a collection from the
	 * specified constructor arguments and the specified default options. *
	 * 
	 * @param {array} constructorArgs the arguments array from the constructor
	 *        function
	 * @param {object} defaultOptions the default values for any options the
	 *        constructor requires
	 */
	transporter.createCollectionOptions = function(constructorArgs,
	        defaultOptions) {
		defaultOptions = defaultOptions || {};
		if (!defaultOptions.hasOwnProperty('equalityComparer')) {
			defaultOptions.equalityComparer = defaultEqualityComparer
		}

		var options = createIterableOptions(constructorArgs, defaultOptions);
		if (!collectionjs.isEqualityComparer(options.equalityComparer)) {
			throw new TypeError(
			        'options.equalityComparer is not an equalityComparer');
		}

		return options;
	};
}(collectionjs, collectionjs.__transporter__));