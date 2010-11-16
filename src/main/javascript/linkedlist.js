/*global collectionjs */
(function(collectionjs, transporter) {
	var checkIndexInclusive = transporter.checkIndexInclusive;
	var createCollectionOptions = transporter.createCollectionOptions;

	var createLinkedList = function(equalityComparer) {
		// Thanks to our friend the sentinel we don't have to check for any of
		// the border conditions. He replaces the head and tail pointers and
		// effectively makes our list a circularly linked list.
		// But that's our secret, we won't let the user know about this.
		var sentinel = {};
		sentinel.next = sentinel;
		sentinel.prev = sentinel;

		var size = 0;

		var linkedList = {
		    size : function() {
			    return size;
		    },

		    listIterator : function(index) {
			    index = index || 0;
			    checkIndexInclusive(index, size);

			    // Iterate to our starting position forward or backward
			    // depending on which is faster.
			    var nextEntry;
			    var i;
			    var middleIndex = size / 2;
			    if (index <= middleIndex) {
				    nextEntry = sentinel.next;
				    for (i = 0; i < index; i++) {
					    nextEntry = nextEntry.next;
				    }
			    }
			    else {
				    nextEntry = sentinel;
				    for (i = size; i > index; i--) {
					    nextEntry = nextEntry.prev;
				    }
			    }

			    // These are just for the add, set, and remove methods
			    var lastReturnedEntry = sentinel;
			    var lastReturnedIndex = -1;

			    var listIter = {
			        hasNext : function() {
				        return nextEntry !== sentinel;
			        },
			        next : function() {
				        if (nextEntry === sentinel) {
					        throw new RangeError("There is no next element");
				        }

				        lastReturnedEntry = nextEntry;
				        lastReturnedIndex = i++;
				        nextEntry = nextEntry.next;

				        return lastReturnedEntry.element;
			        },
			        nextIndex : function() {
				        return i;
			        },
			        hasPrevious : function() {
				        return nextEntry.prev !== sentinel;
			        },
			        previous : function() {
				        if (nextEntry.prev === sentinel) {
					        throw new RangeError("There is no previous element");
				        }

				        nextEntry = nextEntry.prev;
				        lastReturnedEntry = nextEntry;
				        lastReturnedIndex = --i;

				        return lastReturnedEntry.element;
			        },
			        previousIndex : function() {
				        return i - 1;
			        },
			        remove : function() {
				        if (lastReturnedEntry === sentinel) {
					        throw new Error("There is nothing to remove.");
				        }

				        lastReturnedEntry.prev.next = lastReturnedEntry.next;
				        lastReturnedEntry.next.prev = lastReturnedEntry.prev;
				        size--;

				        i = lastReturnedIndex;
				        lastReturnedEntry = sentinel;
				        lastReturnedIndex = -1;
			        },
			        set : function(element) {
				        if (lastReturnedEntry === sentinel) {
					        throw new Error("There is nothing to replace.");
				        }

				        var newEntry = {
				            prev : lastReturnedEntry.prev,
				            element : element,
				            next : lastReturnedEntry.next
				        };

				        lastReturnedEntry.next.prev = newEntry;
				        lastReturnedEntry.prev.next = newEntry;
				        lastReturnedEntry = newEntry;
			        },
			        add : function(element) {
				        var newEntry = {
				            prev : nextEntry.prev,
				            element : element,
				            next : nextEntry
				        };

				        nextEntry.prev.next = newEntry;
				        nextEntry.prev = newEntry;
				        size++;

				        i++;
				        lastReturnedEntry = sentinel;
				        lastReturnedIndex = -1;
			        }
			    };

			    return listIter;
		    },

		    equalityComparer : function() {
			    return equalityComparer;
		    },

		    clear : function() {
			    sentinel.next = sentinel;
			    sentinel.prev = sentinel;
			    size = 0;
		    }
		};
		
		return collectionjs.newAbstractSequentialAccessList(linkedList);
	};

	collectionjs.newLinkedList = function() {
		var options = createCollectionOptions(arguments);
		var linkedList = createLinkedList(options.equalityComparer);
		if (options.iterable) {
			linkedList.addAll(options.iterable);
		}
		return linkedList;
	};
}(collectionjs, collectionjs.__transporter__));