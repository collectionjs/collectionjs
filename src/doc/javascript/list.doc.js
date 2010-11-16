/**
 * @class
 * @augments collectionjs.interfaces.collection
 */
collectionjs.interfaces.list =
/** @lends collectionjs.interfaces.list# */
{
    get : function(index) {
	    throw Error();
    },
    
    indexOf : function(element, equalityComparer) {
	    throw Error();
    },

    lastIndexOf : function(element, equalityComparer) {
	    throw Error();
    },

    listIterator : function(index) {
	    throw Error();
    },
    
    subList : function() {
	    throw Error();
    },

    set : function(index, element) {
	    throw Error();
    },

    addAt : function(index, element) {
	    throw Error();
    },

    addAllAt : function(index, iterableOrArray) {
	    throw Error();
    },

    removeAt : function(element, equalityComparer) {
	    throw Error();
    }
};
