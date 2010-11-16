/**
 * @class
 * @augment collectionjs.interfaces.iterable
 */
collectionjs.interfaces.mapIterator =
/** @lends collectionjs.mapIterator# */
{
    /**
	 * Returns the key of the next map entry in this iteration and increments
	 * the current position in the iteration.
	 * 
	 * @returns the next key
	 * @throws {Error} if there is no next entry in the iteration
	 */
    next : function() {
	    throw Error();
    },

    /**
	 * Returns the last key returned by {@link #next}.
	 */
    getKey : function() {
	    throw Error();
    },

    /**
	 * Returns the value of the last key returned by {@link #next}.
	 */
    getValue : function() {
	    throw Error();
    },

    /**
	 * (Optional) Sets the value of the current entry.
	 * 
	 * @param value the new value
	 * @optional
	 */
    setValue : function(value) {
	    throw Error();
    }
};

/**
 * @class
 */
collectionjs.interfaces.mapIterable =
/** @lends collectionjs.interfaces.mapIterable# */
{
	/**
	 * Returns a map iterable over the entries in the map.
	 * 
	 * @returns {collectionjs.interfaces.mapIterator}
	 */
	mapIterator : function() {
		throw Error();
	}
};