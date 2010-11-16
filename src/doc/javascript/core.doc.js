/**
 * @namespace
 */
collectionjs.interfaces = {};

/**
 * @class
 */
collectionjs.interfaces.iterator =
/** @lends collectionjs.interfaces.iterator# */
{
    /**
	 * Returns true if there is a next element in the iteration.
	 * 
	 * @returns {boolean} true if there is at least one more element
	 */
    hashNext : function() {
	    throw Error();
    },

    /**
	 * Returns the next element in this iteration and increments the current
	 * position in the iteration.
	 * 
	 * @returns the next element
	 * @throws {Error} if there is no next element in the iteration
	 */
    next : function() {
	    throw Error();
    },

    /**
	 * (Optional) Removes the last element returned by a call to {@link #next}.
	 * This can only be called once per call to <code>next</code>.
	 * 
	 * @throws {Error} if there is no element to remove
	 */
    remove : function() {
	    throw Error();
    }
};

/**
 * @class
 */
collectionjs.interfaces.equalityComparer =
/** @lends collectionjs.interfaces.equalityComparer# */
{
    /**
	 * Returns true if the specified objects are considered equal.
	 * <p>
	 * This implementation returns <code>a === b</code>.
	 * 
	 * @param a one of the objects to compare
	 * @param b one of the objects to compare
	 * @returns true if the objects are equal
	 */
    equals : function(a, b) {
	    throw Error();
    },

    /**
	 * Returns a string hash value for the specified object. This may be used
	 * when storing the object as a property of another object.
	 * <p>
	 * This implementation returns the default string value of the object
	 * (normally <code>obj.toString()</code>).
	 * 
	 * @param obj the object for which to get a hash string
	 * @returns a hash string for the specified object
	 */
    hashString : function(obj) {
	    throw Error();
    }
};

/**
 * @class
 */
collectionjs.interfaces.copyFunctionOptions =
/** @lends collectionjs.interfaces.extendCollectionOptions# */
{
    /**
	 * Whether all methods should be copied by default.
	 * 
	 * @optional
	 */
    all : false,

    /**
	 * Whether the core methods should be copied.
	 * 
	 * @optional
	 */
    core : false,

    /**
	 * Whether any extension methods should be copied.
	 * 
	 * @optional
	 */
    extension : false,

    /**
	 * Whether modifiable methods should be copied by default.
	 * 
	 * @optional
	 */
    modifiable : false,

    /**
	 * Whether any methods for adding elements should be copied.
	 * 
	 * @optional
	 */
    add : false,

    /**
	 * Whether any methods for editing or setting elements should be copied.
	 * 
	 * @optional
	 */
    set : false,

    /**
	 * Whether any methods for putting mappings into a map should be copied.
	 * 
	 * @optional
	 */
    put : false,

    /**
	 * Whether any methods for removing elements should be copied.
	 * 
	 * @optional
	 */
    remove : false
};