/*global collectionjs */
(function(collectionjs, transporter) {
	var createMapIterableOptions = transporter.createMapIterableOptions;

	var defaultKeyEqualityComparer = collectionjs.newEqualityComparer( {
		equals : function(a, b) {
			return a.toString() === b.toString();
		}
	});
	var defaultValueEqualityComparer = collectionjs.newEqualityComparer();

	/**
	 * 
	 */
	collectionjs.newObjectMap = function() {
		var options = createMapIterableOptions(arguments, {
		    keyEqualityComparer : defaultKeyEqualityComparer,
		    valueEqualityComparer : defaultValueEqualityComparer
		});

		var keyEqualityComparer = options.keyEqualityComparer;
		if (!collectionjs.isEqualityComparer(keyEqualityComparer)) {
			throw new TypeError(
			        'options.keyEqualityComparer is not an equalityComparer');
		}

		var valueEqualityComparer = options.valueEqualityComparer;
		if (!collectionjs.isEqualityComparer(valueEqualityComparer)) {
			throw new TypeError(
			        'options.valueEqualityComparer is not an equalityComparer');
		}

		var obj = {};
		var size = 0;

		var listSentinel = {};
		listSentinel.listNext = listSentinel;
		listSentinel.listPrev = listSentinel;

		var findMatchingAndPreviousEntry = function(key, hashString) {
			var entry = obj[hashString];

			var previousEntry;
			var matchingEntry;
			while (entry) {
				if (keyEqualityComparer.equals(key, entry.key)) {
					matchingEntry = entry;
					break;
				}
				else {
					previousEntry = entry;
					entry = entry.bucketNext;
				}
			}

			return {
			    previousEntry : previousEntry,
			    matchingEntry : matchingEntry
			};
		};

		var removeEntry = function(entry, previousEntry, hashString) {
			if (previousEntry) {
				previousEntry.bucketNext = entry.bucketNext;
			}
			else if (entry.bucketNext) {
				obj[hashString] = entry.bucketNext;
			}
			else {
				delete obj[hashString];
			}

			entry.listPrev.listNext = entry.listNext;
			entry.listNext.listPrev = entry.listPrev;
			size--;
		};

		var objectMap = {
		    keyEqualityComparer : function() {
			    return keyEqualityComparer;
		    },
		    valueEqualityComparer : function() {
			    return valueEqualityComparer;
		    },
		    size : function() {
			    return size;
		    },
		    mapIterator : function() {
			    var nextEntry = listSentinel.listNext;
			    var lastReturnedEntry = listSentinel;

			    return {
			        hasNext : function() {
				        return nextEntry !== listSentinel;
			        },
			        next : function() {
				        if (nextEntry === listSentinel) {
					        throw new RangeError("There is no next element");
				        }

				        lastReturnedEntry = nextEntry;
				        nextEntry = nextEntry.listNext;

				        return lastReturnedEntry.key;
			        },
			        getKey : function() {
				        if (lastReturnedEntry === listSentinel) {
					        throw new Error("There is no current entry.");
				        }
				        return lastReturnedEntry.key;
			        },
			        getValue : function() {
				        if (lastReturnedEntry === listSentinel) {
					        throw new Error("There is no current entry.");
				        }
				        return lastReturnedEntry.value;
			        },
			        setValue : function(value) {
				        if (lastReturnedEntry === listSentinel) {
					        throw new Error("There is no current entry.");
				        }
				        lastReturnedEntry.value = value;
			        },
			        remove : function() {
				        if (lastReturnedEntry === listSentinel) {
					        throw new Error("There is nothing to remove.");
				        }

				        // We need to find the previous entry (if any) so we can
				        // update its bucketNext pointer.
				        var hashString = keyEqualityComparer
				                .hashString(lastReturnedEntry.key);
				        var previousEntry;
				        var bucketNextEntry = obj[hashString];
				        while (bucketNextEntry !== lastReturnedEntry) {
					        previousEntry = bucketNextEntry;
					        bucketNextEntry = bucketNextEntry.bucketNext;
				        }
				        removeEntry(lastReturnedEntry, previousEntry,
				                hashString);

				        lastReturnedEntry = listSentinel;
			        }
			    };
		    },
		    get : function(key) {
			    if (typeof key === 'undefined') {
				    throw new ReferenceError('key');
			    }

			    var hashString = keyEqualityComparer.hashString(key);
			    var value;

			    var entry = obj[hashString];
			    while (entry) {
				    if (keyEqualityComparer.equals(key, entry.key)) {
					    value = entry.value;
					    break;
				    }
				    entry = entry.bucketNext;
			    }

			    return value;
		    },
		    put : function(key, value) {
			    if (typeof key === 'undefined') {
				    throw new ReferenceError('key');
			    }

			    var hashString = keyEqualityComparer.hashString(key);

			    var result = findMatchingAndPreviousEntry(key, hashString);
			    var previousEntry = result.previousEntry;
			    var matchingEntry = result.matchingEntry;

			    var newEntry;
			    var oldValue;
			    if (typeof matchingEntry !== 'undefined') {
				    // If we already have a matching entry in the map then we
				    // just need to update its value.
				    newEntry = matchingEntry;
				    oldValue = matchingEntry.value;
				    matchingEntry.value = value;

				    // Remove the matching entry from the linked list (because
				    // we need to move it to the end of the list)
				    matchingEntry.listPrev.listNext = matchingEntry.listNext;
				    matchingEntry.listNext.listPrev = matchingEntry.listPrev;
			    }
			    else {
				    // If we don't already have a matching entry then we have to
				    // create it and add it to the end of the bucket list
				    // (if there is already a bucket).
				    newEntry = {
				        key : key,
				        value : value
				    };
				    if (typeof previousEntry === 'undefined') {
					    obj[hashString] = newEntry;
				    }
				    else {
					    previousEntry.bucketNext = newEntry;
				    }
				    size++;
			    }

			    // Update the list pointers of the new entry and sentinel so the
			    // newEntry is always the last entry.
			    newEntry.listPrev = listSentinel.listPrev;
			    newEntry.listNext = listSentinel;
			    listSentinel.listPrev.listNext = newEntry;
			    listSentinel.listPrev = newEntry;

			    return oldValue;
		    },
		    remove : function(key) {
			    if (typeof key === 'undefined') {
				    throw new ReferenceError('key');
			    }

			    var hashString = keyEqualityComparer.hashString(key);

			    var result = findMatchingAndPreviousEntry(key, hashString);
			    var previousEntry = result.previousEntry;
			    var matchingEntry = result.matchingEntry;

			    var oldValue;
			    if (typeof matchingEntry !== 'undefined') {
				    oldValue = matchingEntry.value;
				    removeEntry(matchingEntry, previousEntry, hashString);
			    }

			    return oldValue;
		    }
		};

		objectMap = collectionjs.newAbstractMap(objectMap);

		// Now that the map is fully defined we can add any initial values
		if (options.mapIterable) {
			objectMap.putAll(options.mapIterable);
		}

		return objectMap;
	};
}(collectionjs, collectionjs.__transporter__));