/*global collectionjs */
(function(collectionjs, transporter) {
	var create = transporter.create;
	var normalizeCopyOptions = transporter.normalizeCopyOptions;
	var copyFunctionsAsNeeded = transporter.copyFunctionsAsNeeded;
	var extend = transporter.extend;
	var toIterable = transporter.toIterable;
	var checkIndexExclusive = transporter.checkIndexExclusive;
	var checkIndexInclusive = transporter.checkIndexInclusive;

	// /////////////////
	// Abstract List //
	// ///////////////

	/**
	 * Returns true if the specified object has all of the functions required to
	 * be a list.
	 * 
	 * @param maybeList the object to check
	 * @return true if the object is a list
	 */
	collectionjs.isList = function(maybeList) {
		return collectionjs.isCollection(maybeList) &&
		        typeof maybeList.get === 'function' &&
		        typeof maybeList.listIterator === 'function' &&
		        typeof maybeList.indexOf === 'function' &&
		        typeof maybeList.lastIndexOf === 'function' &&
		        typeof maybeList.subList === 'function';
	};

	/**
	 * @class
	 * @augments collectionjs.protos.collection
	 * @augments collectionjs.interfaces.list
	 */
	collectionjs.protos.list = create(collectionjs.protos.collection,
	/** @lends collectionjs.protos.list# */
	{
	    /**
		 * This implementation iterates through each element in the list until
		 * it finds an element equal to the specified element according to
		 * {@link #equalityComparer}).
		 */
	    indexOf : function(element) {
		    var i = 0;
		    var iter = this.iterator();
		    var equalityComparer = this.equalityComparer();
		    while (iter.hasNext()) {
			    var nextElement = iter.next();
			    if (equalityComparer.equals(element, nextElement) === true) {
				    return i;
			    }
			    i++;
		    }

		    return -1;
	    },

	    /**
		 * This implementation iterates backwards through each element in the
		 * list using {@link #listIterator} until it finds an element equal to
		 * the specified element according to {@link #equalityComparer}).
		 */
	    lastIndexOf : function(element) {
		    var i = this.size();
		    var listIter = this.listIterator(i);
		    var equalityComparer = this.equalityComparer();
		    while (listIter.hasPrevious()) {
			    var nextElement = listIter.previous();
			    i--;
			    if (equalityComparer.equals(element, nextElement) === true) {
				    return i;
			    }
		    }

		    return -1;
	    },

	    /**
		 * Returns a view of the list with the specified start index (inclusive)
		 * and end index (exclusive).
		 * 
		 * @param fromIndex the index of the first element to include in the
		 *        list
		 * @param [toIndex] the index after the last element to include in the
		 *        list; if not specified then this will default to the size of
		 *        the list
		 * @returns {@link collectionjs.interfaces.list} the subList view
		 */
	    subList : function(fromIndex, toIndex) {
		    return newSubList(this, {
		        fromIndex : fromIndex,
		        toIndex : toIndex
		    });
	    }
	});
	var listPrototype = collectionjs.protos.list;

	var modifiableListPrototype = create(collectionjs.protos.list, {
	    /**
		 * This implementation calls {@link #addAt} using an index equal to
		 * {@link #size}.
		 */
	    add : function(element) {
		    this.addAt(this.size(), element);
		    return true;
	    },

	    /**
		 * This implementation creates a {@link #listIterator} at the specified
		 * index and adds each item in the specified iterable using the
		 * <code>add</code> method of the listIterator.
		 */
	    addAllAt : function(index, iterableOrArray) {
		    checkIndexInclusive(index, this.size());
		    var iterable = toIterable(iterableOrArray);

		    var listIter = this.listIterator(index);
		    var iter = iterable.iterator();
		    var isAny = iter.hasNext();
		    while (iter.hasNext()) {
			    listIter.add(iter.next());
		    }

		    return isAny;
	    }
	});

	var copyListMethods = function(destination, options) {
		options = normalizeCopyOptions(options, [ 'add' ]);

		// Detect whether we need to copy any types of optional methods
		if (typeof options.add === 'undefined') {
			options.add = (typeof destination.addAt === 'function');
		}

		var coreMethodNames = [ 'indexOf', 'lastIndexOf', 'subList' ];
		var modifiableMethodNamesByType = {
			add : [ 'add', 'addAllAt' ]
		};

		copyFunctionsAsNeeded(destination, listPrototype,
		        modifiableListPrototype, coreMethodNames,
		        modifiableMethodNamesByType, options);
		collectionjs.copyCollectionMethods(destination, options);
	};

	var newAbstractList = function(methods) {
		if (typeof methods.iterator !== 'function') {
			throw new Error('list requires iterator function');
		}
		if (typeof methods.size !== 'function') {
			throw new Error('list requires size function');
		}

		var iter = methods.iterator();
		var options = {
		    core : false,
		    extension : false,
		    add : (typeof methods.addAt === 'function'),
		    remove : (typeof iter.remove === 'function')
		};

		var newObject = create(listPrototype, methods);
		copyListMethods(newObject, options);
		return newObject;
	};

	// ///////////
	// SubList //
	// /////////

	var newSubList = function(list, options) {
		var listSize = list.size();
		var defaultOptions = {
		    fromIndex : 0,
		    toIndex : listSize
		};
		options = extend(defaultOptions, options);

		var fromIndex = options.fromIndex;
		var toIndex = options.toIndex;

		checkIndexInclusive(fromIndex, listSize);
		checkIndexInclusive(toIndex, listSize);
		if (fromIndex > toIndex) {
			throw new Error("fromIndex cannot be greater than toIndex");
		}

		var size = toIndex - fromIndex;
		var subList = {
		    size : function() {
			    return size;
		    },

		    iterator : function() {
			    var listIter = this.listIterator();
			    var iter = {
			        hasNext : function() {
				        return listIter.hasNext();
			        },
			        next : function() {
				        return listIter.next();
			        }
			    };
			    if (typeof listIter.remove === 'function') {
				    iter.remove = function() {
					    listIter.remove();
				    };
			    }

			    return iter;
		    },

		    listIterator : function(index) {
			    if (typeof index !== 'undefined') {
				    checkIndexInclusive(index, size);
				    index = index + fromIndex;
			    }
			    else {
				    index = fromIndex;
			    }

			    var baseIter = list.listIterator(index);
			    var listIter = {
			        hasNext : function() {
				        var i = this.nextIndex();
				        return i < size;
			        },
			        next : function() {
				        if (!this.hasNext()) {
					        throw new RangeError("index <" + this.nextIndex() +
					                "> is out of range [0, " + size + ")");
				        }
				        return baseIter.next();
			        },
			        nextIndex : function() {
				        return baseIter.nextIndex() - fromIndex;
			        },
			        hasPrevious : function() {
				        var i = this.previousIndex();
				        return i >= 0;
			        },
			        previous : function() {
				        if (!this.hasPrevious()) {
					        throw new RangeError("index <" +
					                this.previousIndex() +
					                "> is out of range [0, " + size + "}");
				        }
				        return baseIter.previous();
			        },
			        previousIndex : function() {
				        return baseIter.previousIndex() - fromIndex;
			        }
			    };

			    if (typeof baseIter.add === 'function') {
				    listIter.add = function(element) {
					    baseIter.add(element);
					    toIndex++;
					    size++;
				    };
			    }

			    if (typeof baseIter.set === 'function') {
				    listIter.set = function(element) {
					    baseIter.set(element);
				    };
			    }

			    if (typeof baseIter.remove === 'function') {
				    listIter.remove = function() {
					    baseIter.remove();
					    toIndex--;
					    size--;
				    };
			    }

			    return listIter;
		    },

		    get : function(index) {
			    checkIndexExclusive(index, size);
			    return list.get(index + fromIndex);
		    },

		    subList : function(from, to) {
			    // A sublist within a sublist? This is the most awesome thing
			    // anyone has ever done.
			    return newSubList(list, {
			        fromIndex : fromIndex + from,
			        toIndex : toIndex - to
			    });
		    }
		};

		if (typeof list.set === 'function') {
			subList.set = function(index, element) {
				checkIndexExclusive(index, size);
				return list.set(index + fromIndex, element);
			};
		}

		if (typeof list.addAt === 'function') {
			subList.addAt = function(index, element) {
				checkIndexInclusive(index, size);
				var isSuccess = list.addAt(index + fromIndex, element);
				if (isSuccess !== false) {
					toIndex++;
					size++;
				}

				return isSuccess;
			};
		}

		if (typeof list.removeAt === 'function') {
			subList.removeAt = function(index) {
				checkIndexExclusive(index, size);
				var result = list.removeAt(index + fromIndex);
				toIndex--;
				size--;
				return result;
			};
		}

		return newAbstractList(subList);
	};

	// //////////////////////
	// Random Access List //
	// ////////////////////

	var randomAccessListPrototype = create(listPrototype, {
	    iterator : function() {
		    var i = 0;
		    var prev = -1;
		    var list = this;
		    var size = list.size();

		    var iter = {
		        hasNext : function() {
			        return i < size;
		        },
		        next : function() {
			        prev = i;
			        return list.get(i++);
		        }
		    };

		    if (typeof list.removeAt === 'function') {
			    iter.remove = function() {
				    if (prev < 0) {
					    throw new Error("There is nothing to remove");
				    }

				    list.removeAt(prev);
				    size--;
				    i = prev;
				    prev = -1;
			    };
		    }

		    return iter;
	    },

	    listIterator : function(index) {
		    var i;

		    var list = this;
		    var listSize = this.size();
		    if (typeof index !== 'undefined') {
			    checkIndexInclusive(index, listSize);
			    i = index;
		    }
		    else {
			    i = 0;
		    }

		    var lastReturned = -1;
		    var listIter = {
		        hasNext : function() {
			        return i < listSize;
		        },
		        next : function() {
			        lastReturned = i;
			        return list.get(i++);
		        },
		        nextIndex : function() {
			        return i;
		        },
		        hasPrevious : function() {
			        return i > 0;
		        },
		        previous : function() {
			        lastReturned = i - 1;
			        return list.get(--i);
		        },
		        previousIndex : function() {
			        return i - 1;
		        }
		    };

		    if (typeof list.addAt === 'function') {
			    listIter.add = function(element) {
				    list.addAt(i, element);
				    i++;
				    lastReturned = -1;
			    };
		    }

		    if (typeof list.set === 'function') {
			    listIter.set = function(element) {
				    if (lastReturned < 0) {
					    throw new Error("Invalid state for set");
				    }
				    list.set(lastReturned, element);
			    };
		    }

		    if (typeof list.removeAt === 'function') {
			    listIter.remove = function() {
				    if (lastReturned < 0) {
					    throw new Error("Invalid state for remove");
				    }

				    list.removeAt(lastReturned);
				    i = lastReturned;
				    lastReturned = -1;
				    listSize--;
			    };
		    }

		    return listIter;
	    }
	});


	var modifiableRandomAccessListPrototype = create(randomAccessListPrototype);
	copyListMethods(modifiableRandomAccessListPrototype, {
	    all : false,
	    modify : true
	});

	/**
	 * 
	 */
	collectionjs.copyRandomAccessListMethods = function(destination, options) {
		options = normalizeCopyOptions(options);

		var coreMethodNames = [ 'iterator', 'listIterator'];
		var modifiableMethodNamesByType = {};
		copyFunctionsAsNeeded(destination, randomAccessListPrototype,
		        modifiableRandomAccessListPrototype, coreMethodNames,
		        modifiableMethodNamesByType, options);

		copyListMethods(destination, options);
	};

	/**
	 * 
	 */
	collectionjs.newAbstractRandomAccessList = function(methods) {
		if (typeof methods.size !== 'function') {
			throw new Error('list requires size function');
		}
		if (typeof methods.get !== 'function') {
			throw new Error('randomAccessList requires get function');
		}

		var iter = methods.iterator();
		var options = {
		    all : false,
		    add : (typeof methods.addAt === 'function'),
		    remove : (typeof iter.remove === 'function')
		};

		var newObject;
		if (options.add !== false && options.remove !== false) {
			newObject = create(modifiableRandomAccessListPrototype, methods);
		}
		else {
			newObject = create(randomAccessListPrototype, methods);
			collectionjs.copyRandomAccessListMethods(newObject, options);
		}

		return newObject;
	};

	// //////////////////////////
	// Sequential Access List //
	// ////////////////////////

	var sequentialAccessListPrototype = create(listPrototype, {
	    iterator : function() {
		    var listIter = this.listIterator();
		    var iter = {
		        hasNext : function() {
			        return listIter.hasNext();
		        },
		        next : function() {
			        return listIter.next();
		        }
		    };
		    if (typeof listIter.remove === 'function') {
			    iter.remove = function() {
				    listIter.remove();
			    };
		    }
		    return iter;
	    },

	    get : function(index) {
		    checkIndexExclusive(index, this.size());

		    var listIter = this.listIterator(index);
		    return listIter.next();
	    }
	});

	var modifiableSequentialAccessListPrototype = create(
	        sequentialAccessListPrototype, {
	            addAt : function(index, element) {
		            checkIndexInclusive(index, this.size());

		            var listIter = this.listIterator(index);
		            listIter.add(element);
		            return true;
	            },

	            set : function(index, element) {
		            checkIndexExclusive(index, this.size());

		            var listIter = this.listIterator(index);
		            listIter.next();
		            listIter.set(element);
	            },

	            removeAt : function(index) {
		            var listIter = this.listIterator(index);
		            listIter.next();
		            listIter.remove();
	            }
	        });
	copyListMethods(modifiableSequentialAccessListPrototype, {
	    all : false,
	    modify : true
	});

	/**
	 * 
	 */
	collectionjs.copySequentialAccessListMethods = function(destination,
	        options) {
		options = normalizeCopyOptions(options, [ 'add', 'set', 'remove' ]);

		// Detect whether we need to copy any types of optional methods
		if (typeof destination.listIterator !== 'undefined') {
			var listIter;
			if (typeof options.add === 'undefined') {
				listIter = listIter || destination.listIterator();
				options.add = (typeof listIter.add === 'function');
			}
			if (typeof options.set === 'undefined') {
				listIter = listIter || destination.listIterator();
				options.set = (typeof listIter.set === 'function');
			}
			if (typeof options.remove === 'undefined') {
				listIter = listIter || destination.listIterator();
				options.remove = (typeof listIter.remove === 'function');
			}
		}

		var coreMethodNames = [ 'iterator', 'get'];
		var modifiableMethodNamesByType = {
		    add : [ 'addAt' ],
		    set : [ 'set' ],
		    remove : [ 'removeAt' ]
		};
		copyFunctionsAsNeeded(destination, sequentialAccessListPrototype,
		        modifiableSequentialAccessListPrototype, coreMethodNames,
		        modifiableMethodNamesByType, options);

		copyListMethods(destination, options);
	};

	/**
	 * 
	 */
	collectionjs.newAbstractSequentialAccessList = function(methods) {
		if (typeof methods.size !== 'function') {
			throw new Error('list requires size function');
		}
		if (typeof methods.listIterator !== 'function') {
			throw new Error(
			        'sequentialAccessList requires listIterator function');
		}

		var listIter = methods.listIterator();
		var options = {
		    core : false,
		    extension : false,
		    add : (typeof listIter.add === 'function'),
		    set : (typeof listIter.set === 'function'),
		    remove : (typeof listIter.remove === 'function')
		};

		var newObject;
		if (options.add !== false && options.set !== false &&
		        options.remove !== false) {
			newObject = create(modifiableSequentialAccessListPrototype, methods);
		}
		else {
			newObject = create(sequentialAccessListPrototype, methods);
			collectionjs.copySequentialAccessListMethods(newObject, options);
		}

		return newObject;
	};
}(collectionjs, collectionjs.__transporter__));