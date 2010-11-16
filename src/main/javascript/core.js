/**
 * @namespace Holds all of the collectionjs functionality.
 */
var collectionjs = {};

(function(collectionjs) {
	/**
	 * @namespace Holds all of the collectionjs prototype objects.
	 */
	collectionjs.protos = {};
	collectionjs.prototypes = collectionjs.protos;

	/**
	 * Returns true if the specified object is an iterator.
	 * 
	 * @param maybeIterator the object to check
	 * @return {boolean} true if the specified object is an iterator
	 */
	collectionjs.isIterator = function(maybeIterator) {
		return typeof maybeIterator === 'object' && maybeIterator !== null &&
		        typeof maybeIterator.hasNext === 'function' &&
		        typeof maybeIterator.next === 'function';
	};

	/**
	 * Returns true if the specified object is an equality comparer.
	 * 
	 * @param maybeEqualityComparer the object to check
	 * @return true if the object is an equality comparer
	 */
	collectionjs.isEqualityComparer = function(maybeEqualityComparer) {
		return typeof maybeEqualityComparer === 'object' &&
		        maybeEqualityComparer !== null &&
		        typeof maybeEqualityComparer.equals === 'function' &&
		        typeof maybeEqualityComparer.hashString === 'function';
	};

	/**
	 * Creates and returns a subclass of the specified parent object and
	 * optionally copies the specified methods to the newly created object.
	 * 
	 * @param {object} parent the prototype from which to create a new object
	 * @param {object} [methods] any additional methods to copy to the new
	 *        object
	 * @return the new object
	 */
	var create = function(parent, methods) {
		if (typeof parent !== 'object') {
			throw new Error('cannot create from ' + (typeof parent));
		}

		var F = function() {
		};
		F.prototype = parent;

		var newObject = new F();

		// Copy all of the methods to the new object (if necessary)
		if (typeof methods === 'object' && methods !== null) {
			var methodName;
			for (methodName in methods) {
				if (methods.hasOwnProperty(methodName) &&
				        typeof methods[methodName] === 'function') {
					newObject[methodName] = methods[methodName];
				}
			}
		}

		return newObject;
	};

	/**
	 * The prototype for an equality comparer. This provides a complete default
	 * implementation for comparing any two objects for equality.
	 */
	var equalityComparerPrototype = equalityComparer = {
	    /**
		 * Returns true if <code>a === b</code>.
		 * 
		 * @param a one of the objects to compare
		 * @param b one of the objects to compare
		 * @returns true if if <code>a === b</code>
		 */
	    equals : function(a, b) {
		    return a === b;
	    },

	    /**
		 * Returns the object's toString implementation.
		 * 
		 * @param obj the object for which to get a hash string
		 * @returns the string representation of the object
		 */
	    hashString : function(obj) {
		    return obj.toString();
	    }
	};

	/**
	 * Creates and returns a new object that implements equality comparer.
	 * 
	 * @param {Object.<Function>} [methods] any methods to include in the new
	 *        object; these will override any default methods
	 * @return {equalityComparer} a new equality comparer
	 */
	collectionjs.newEqualityComparer = function(methods) {
		return create(equalityComparerPrototype, methods);
	};

	/**
	 * The TRANSPORTER takes your private functions and transports them between
	 * files and function scopes. After his work is complete, he disappears
	 * never to be seen again. Thank you, TRANSPORTER, for making sure our
	 * private methods we want to share get to those who need them.
	 * <p>
	 * So basically this is a temporary object used to share code
	 * between two or more of the collectionjs files. It is removed in the
	 * cleanup.js file, so all files have to save the functions that they use
	 * from it in their own local variables.
	 * 
	 * @private
	 */
	collectionjs.__transporter__ = {};
	var transporter = collectionjs.__transporter__;

	transporter.create = create;

	/**
	 * Copies all of the properties from one or more source objects into a
	 * destination object (non-recursive). The first parameter is the
	 * destination object and all other arguments are source objects, where the
	 * last source object's properties has the highest priority. So this is
	 * basically a simplified version of jQuery.extend
	 * 
	 * @param {object} destination the object to which all properties from the
	 *        source object(s) will be copied
	 * @param {object} source the object(s) whose properties should be copied to
	 *        the destination object
	 * @return {object} the destination object
	 */
	transporter.extend = function() {
		var target = arguments[0] || {};
		var objects = Array.prototype.slice.call(arguments, 1);

		for ( var i = 0; i < objects.length; i++) {
			var o = objects[i];
			for ( var key in o) {
				if (o.hasOwnProperty(key)) {
					target[key] = o[key];
				}
			}
		}

		return target;
	};

	/**
	 * Works just like <code>Array.prototype.indexOf</code> but uses its own 
	 * implementation if the javascript engine doesn't have this function.
	 */
	var arrayIndexOf;
	if (typeof Array.prototype.indexOf === 'function') {
		arrayIndexOf = Array.prototype.indexOf;
	}
	else {
		arrayIndexOf = function(elem) {
			for ( var i = 0; i < this.length; i++) {
				if (this[i] === elem) {
					return i;
				}
			}
			return -1;
		};
	}

	/**
	 * Returns true if the specified object can be used like an array. Or more
	 * specifically, that it is an object with a numeric length property.
	 * 
	 * @return {boolean} true if the object is like an array
	 */
	var isArrayLike = function(maybeArrayLike) {
		return typeof maybeArrayLike === 'object' && maybeArrayLike !== null &&
		        typeof maybeArrayLike.length === 'number';
	};
	transporter.isArrayLike = isArrayLike;

	/**
	 * Normalizes the options object that would be passed into a copyMethods
	 * function.
	 * 
	 * @param {collectionjs.interfaces.copyFunctionOptions} options the options
	 *        to normalize
	 * @param {array} modifyTypes all of the types of modification methods that
	 *        the collection can support ('add', 'remove', etc)
	 * @return {collectionjs.interfaces.copyFunctionOptions} the normalized
	 *         options
	 */
	transporter.normalizeCopyOptions = function(options, modifyTypes) {
		if (typeof options === 'undefined') {
			options = {};
		}

		// If the all option is set then that's the default value
		var defaultValue = true;
		if (typeof options.all === 'boolean') {
			defaultValue = options.all;
		}

		// Set the default core and extension values if they aren't already set
		if (typeof options.core !== 'boolean') {
			options.core = defaultValue;
		}
		if (typeof options.extension !== 'boolean') {
			options.extension = defaultValue;
		}

		// Only set a default modify value if the all option is set
		if (typeof options.modify !== 'boolean' &&
		        typeof options.all === 'boolean') {
			options.modify = defaultValue;
		}

		// If the modify option is explicitly specified then set each individual
		// modify type that isn't explicitly specified to the modify value
		if (isArrayLike(modifyTypes) && modifyTypes.length > 0 &&
		        typeof options.modify === 'boolean') {
			var i;
			var length = modifyTypes.length;
			for (i = 0; i < length; i++) {
				var key = modifyTypes[i];
				var value = options[key];
				if (typeof value !== 'boolean') {
					options[key] = options.modify;
				}
			}
		}

		return options;
	};

	/**
	 * Returns true if the specified object has a function with the specified
	 * key or throws an error if the object has a property with the specified
	 * key that is not a function.
	 * 
	 * @param {object} object the object to check
	 * @param {string} key the key to check
	 * @return true if <code>object[key]</code> is a function
	 * @throws Error if the object has a value for the specified key that is not
	 *         a function
	 */
	var hasFunction = function(object, key) {
		var hasProperty = object.hasOwnProperty(key);
		if (hasProperty && typeof object[key] !== 'function') {
			throw new Error('object already has a <' + key +
			        '> property with type <' + typeof object[key] + '>');
		}

		return hasProperty;
	};

	/**
	 * Copies the function with the specified name from the source object to the
	 * destination object if the destination object does not already have a
	 * function with that name.
	 * 
	 * @param {object} destination the object to which to copy the function
	 * @param {object} source the object from which to copy the function
	 * @throws Error if the destination has a value for the specified
	 *         functionName that is not a function
	 */
	var copyFunctionIfNeeded = function(destination, source, functionName) {
		if (!hasFunction(destination, functionName)) {
			destination[functionName] = source[functionName];
		}
	};

	/**
	 * Copies all functions from the specified source object to the destination
	 * object except where the destination object already has a function with
	 * the same name.
	 * 
	 * @param {object} destination the object to which to copy the functions
	 * @param {object} source the object from which to copy the functions
	 * @throws Error if the destination has a value for a key in the source that
	 *         is not a function
	 */
	var copyAllFunctionsIfNeeded = function(destination, source) {
		for ( var key in source) {
			if (source.hasOwnProperty(key) &&
			        typeof source[key] === 'function' &&
			        !hasFunction(destination, key)) {
				destination[key] = source[key];
			}
		}
	};

	/**
	 * Copies all functions with names for which the specified predicate returns
	 * true.
	 * 
	 * @param {object} destination the object to which to copy the functions
	 * @param {object} source the object from which to copy the functions
	 * @param {function} a predicate that is called for each function's name to
	 *        determine whether the function should be copied
	 * @throws Error if the destination has a value for a selected key in the
	 *         source that is not a function
	 */
	var copyAllFunctionsWhere = function(destination, source, predicate) {
		for ( var key in source) {
			if (source.hasOwnProperty(key) &&
			        typeof source[key] === 'function' && predicate(key) >= 0) {
				destination[key] = source[key];
			}
		}
	};

	/**
	 * Copies functions from the specified standard and modifiable methods as
	 * needed for a collection (or map) class. This is a pretty terrible
	 * interface that I would never use for a public method, but since this is
	 * just a transporter method this should be good enough for now.
	 * 
	 * @param {object} destination the object to which to copy the functions
	 * @param {object} standardMethods the object from which to copy the core
	 *        and extension methods
	 * @param {object} modifiableMethods the object from which to copy the
	 *        modifiable methods
	 * @param modifiableMethodNamesByType an object that maps the modifiable
	 *        types to a list of the modifiable method names
	 * @param {collectionjs.interfaces.copyFunctionOptions} options the copy
	 *        options
	 */
	transporter.copyFunctionsAsNeeded = function(destination, standardMethods,
	        modifiableMethods, coreMethodNames, modifiableMethodNamesByType,
	        options) {
		if (options.core !== false && options.extension !== false) {
			copyAllFunctionsIfNeeded(destination, collectionPrototype);
		}
		else {
			if (options.core !== false) {
				copyAllFunctionsWhere(destination, standardMethods, function(
				        key) {
					return (arrayIndexOf.call(coreMethodNames, key) >= 0)
				});
			}
			if (options.extension !== false) {
				copyAllFunctionsWhere(destination, standardMethods, function(
				        key) {
					return (arrayIndexOf.call(coreMethodNames, key) < 0)
				});
			}
		}

		var modifyType;
		for (modifyType in modifiableMethodNamesByType) {
			if (options[modifyType] !== false) {
				var modifiableMethodNames = modifiableMethodNamesByType[modifyType];
				var i;
				var length = modifiableMethodNames.length;
				for (i = 0; i < length; i++) {
					var modifiableMethodName = modifiableMethodNames[i];
					copyFunctionIfNeeded(destination, modifiableMethods,
					        modifiableMethodName);
				}
			}
		}
	};
}(collectionjs));