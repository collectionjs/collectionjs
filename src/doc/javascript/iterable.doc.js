/**
 * @class
 */
collectionjs.interfaces.iterable =
/** @lends collectionjs.interfaces.iterable# */
{
	/**
	 * Returns an iterator over the elements in this collection of elements.
	 * 
	 * @return {collectionjs.interfaces.iterator} an iterator over the elements
	 *         in this collection
	 */
	iterator : function() {
		throw Error();
	}
};