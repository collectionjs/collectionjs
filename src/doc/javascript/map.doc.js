/**
 * @class
 * @augments collectionjs.interfaces.keyValuePair
 */
collectionjs.interfaces.mapEntry =
/** @lends collectionjs.interfaces.mapEntry# */
{
    /**
	 * Returns the key of this key-value pair.
	 */
    getKey : function() {
	    throw Error();
    },

    /**
	 * Returns the value of this key-value pair.
	 */
    getValue : function() {
	    throw Error();
    },

    /**
	 * (Optional) Sets the value of this key-value pair.
	 * 
	 * @param value
	 *            the new value
	 * 
	 * @optional
	 */
    setValue : function(value) {
	    throw Error();
    }
};

/**
 * @class
 * @augments collectionjs.interfaces.mapIterable
 */
collectionjs.interfaces.map =
/** @lends collectionjs.interfaces.map# */
{
    /**
	 * Returns the equality comparer for the keys in this map.
	 * 
	 * @returns {collectionjs.interfaces.equalityComparer} the key equality
	 *          comparer
	 */
    keyEqualityComparer : function() {
	    throw Error();
    },

    /**
	 * Returns the equality comparer for the values in this map.
	 * 
	 * @returns {collectionjs.interfaces.equalityComparer} the value equality
	 *          comparer
	 */
    valueEqualityComparer : function() {
	    throw Error();
    },

    /**
	 * Returns the number of mappings in this map.
	 * 
	 * @returns {number} the number of mappings
	 */
    size : function() {
	    throw Error();
    },

    /**
	 * Returns the value that is mapped to the specified key. If no value has
	 * been mapped then this will return <code>undefined</code>.
	 * 
	 * @param key
	 *            the key for which to get a value
	 * 
	 * @return the value mapped to the specified key or undefined
	 */
    get : function(key) {
	    throw Error();
    },

    /**
	 * Returns true if the map contains a value for the specified key.
	 * 
	 * @param key
	 *            the key for which to check
	 * 
	 * @returns true if this map contains a value for the specified key
	 */
    containsKey : function(key) {
	    throw Error();
    },

    /**
	 * <p>
	 * Returns true if the map contains the specified value for at least one
	 * key.
	 * </p>
	 * 
	 * <p>
	 * By default, the equality of an element is determined by
	 * {@link #valueEqualityComparer}. A different value equality comparer can
	 * be specified as a parameter, but note that specifying an equality
	 * comparer could result in a slower search in some types of maps.
	 * </p>
	 * 
	 * @param value
	 *            the value for which to check
	 * 
	 * @param {collectionjs.interfaces.equalityComparer}
	 *            [equalityComparer] an optional custom equality comparer to use
	 *            for comparing values
	 * 
	 * @returns true if this map contains at least one key for the specified
	 *          value
	 */
    containsValue : function(value, equalityComparer) {
	    throw Error();
    },

    /**
	 * <p>
	 * Returns a set view of the keys in this map.
	 * </p>
	 * 
	 * <p>
	 * The order of the items when iterating over this view must be the same as
	 * the order of the items in {@link #values} and {@link #entries}. If the
	 * remove operation is supported by this iterable then removing from the
	 * iterator will also remove from this map.
	 * </p>
	 * 
	 * @returns {collectionjs.interfaces.iterable} an iterable view of the keys
	 */
    keySet : function() {
	    throw Error();
    },

    /**
	 * <p>
	 * Returns a collection view of the values in this map.
	 * </p>
	 * 
	 * <p>
	 * The order of the items when iterating over this view must be the same as
	 * the order of the items in {@link #keys} and {@link #entries}. If the
	 * remove operation is supported by this iterable then removing from the
	 * iterator will also remove from this map.
	 * </p>
	 * 
	 * @returns {collectionjs.interfaces.iterable} an iterable view of the
	 *          values
	 */
    values : function() {
	    throw Error();
    },

    /**
	 * Maps the specified value to the specified key. If the map already
	 * contains a mapping for an equal key (as defined by
	 * {@link #keyEqualityComparer} then the old mapping will be replaced.
	 * 
	 * @param key
	 *            the key to which the value will be mapped
	 * @param value
	 *            the value to map
	 * 
	 * @returns the previously mapped value or <code>undefined</code> if this
	 *          is a new mapping
	 *          
	 * @optional
	 */
    put : function(key, value) {
	    throw Error();
    },

    /**
	 * <p>
	 * Puts all of the mappings from the specified collection into this map.
	 * This is functionally equivalent to calling {@link #put} on this map for
	 * each element in the collection.
	 * </p>
	 * 
	 * <p>
	 * The specified collection can be another map or an iterable (or array)
	 * over a collection of {@link collectionjs.interfaces.keyValuePair}
	 * objects.
	 * </p>
	 * 
	 * @param
	 * {collectionjs.interfaces.map|collectionjs.interfaces.iterable|Array}
	 * mapOrIterableOrArray the mappings to add to this map
	 * 
	 * @optional
	 */
    putAll : function(mapOrIterableOrArray) {
	    throw Error();
    },

    /**
	 * Removes the mapping for the specified key (if any).
	 * 
	 * @param key
	 *            the key for which to remove the mapping
	 * 
	 * @returns the value that was mapped to the key or <code>undefined</code>
	 *          if the key had no mapping
	 * @optional
	 */
    removeAt : function(key) {
	    throw Error();
    },

    /**
     * Removes all mappings from this map.
     * @optional
     */
    clear : function() {
	    throw Error();
    }
};
