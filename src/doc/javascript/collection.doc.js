/**
 * @class
 * @augments collectionjs.interfaces.iterable
 */
collectionjs.interfaces.collection =
/** @lends collectionjs.interfaces.collection# */
{
    /**
	 * Returns the equality comparer used by this collection. This is used to
	 * define equality for methods such as {@link #contains} and {@link #remove}.
	 * 
	 * @returns {collectionjs.interfaces.equalityComparer} the equality comparer
	 */
    equalityComparer : function() {
	    throw Error();
    },

    /**
	 * Returns the number of elements in this collection.
	 * 
	 * @return {number} the size of this collection
	 */
    size : function() {
	    throw Error();
    },

    /**
	 * Returns true if there are no elements in the collection.
	 * 
	 * @returns {boolean} true if the collection is empty
	 */
    isEmpty : function() {
	    throw Error();
    },

    /**
	 * Returns true if this collection contains at least one instance of the
	 * specified element. The {@link #equalityComparer} is used to compare the
	 * element to the elements in this collection.
	 * 
	 * @param element the element for which to check
	 * @returns true if this contains the element
	 */
    contains : function(element) {
	    throw Error();
    },

    /**
	 * Returns true if this collection contains at least one instance of all of
	 * the elements in the specified iterable. This is functionally equivalent
	 * to calling {@link #contains} on all of the elements, but this may have
	 * better performance for some types of collections.
	 * 
	 * @param {collectionjs.interfaces.iterable|Array} iterableOrArray the
	 *        elements to check for; this can be an iterable object
	 * @returns true if this contains all of the elements
	 */
    containsAll : function(iterableOrArray) {
	    throw Error();
    },

    /**
	 * Returns an array that contains all of the elements in this collection.
	 * 
	 * @returns {Array} an array that contains all of the elements in this
	 *          collection
	 */
    toArray : function() {
	    throw Error();
    },

    /**
	 * Adds the specified element to this collection.
	 * <p>
	 * Some collections may have restrictions that could prevent an item from
	 * being added, in which case this method will return false. For example, a
	 * set doesn't allow duplicate elements so when attempting to add multiple
	 * copies of the same element only the first will actually be added.
	 * 
	 * @param element the element to add
	 * @return {boolean} true if the collection was modified as a result of this
	 *         call
	 */
    add : function(element) {
	    throw Error();
    },

    /**
	 * Adds all of the specified elements to this collection.
	 * 
	 * @param {collectionjs.interfaces.iterable|Array} iterableOrArray the
	 *        elements to add
	 * @returns {boolean} true the collection was modified as a result of this
	 *          call
	 */
    addAll : function(iterableOrArray) {
	    throw Error();
    },

    /**
	 * Removes the specified element from this collection. If there is more than
	 * one instance of this element in this collection (as defined by
	 * {@link #equalityComparer}) then it is up to the implementation whether
	 * only one instance will be removed or all of them will be.
	 * 
	 * @param element the element to remove
	 * @returns {boolean} true the collection was modified as a result of this
	 *          call
	 */
    remove : function(element) {
	    throw Error();
    },

    /**
	 * Removes all of the elements from this collection.
	 */
    clear : function() {
	    throw Error();
    },

    /**
	 * Removes all of the elements in this collection that are equal to any of
	 * the specified elements (as defined by {@link #equalityComparer}).
	 * 
	 * @param {collectionjs.interfaces.iterable|Array} iterableOrArray the
	 *        elements to remove
	 * @returns {boolean} true the collection was modified as a result of this
	 *          call
	 */
    removeAll : function(iterableOrArray) {
	    throw Error();
    },

    /**
	 * Removes all of the elements in this collection that are not equal to any
	 * of the specified elements (as defined by {@link #equalityComparer}).
	 * 
	 * @param {collectionjs.interfaces.iterable|Array} iterableOrArray the
	 *        elements to retain
	 * @returns {boolean} true the collection was modified as a result of this
	 *          call
	 */
    retainAll : function(iterableOrArray) {
	    throw Error();
    }
};
