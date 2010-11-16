/*global collectionjs */
(function(collectionjs, helper) {
	var createMapIterableOptions = helper.createMapIterableOptions;
	var isComparer = function(maybeComparer) {
		return typeof maybeComparer === 'object' &&
		        typeof maybeComparer.compare === 'function';
	};

	var defaultComparer = {
		compare : function(a, b) {
			if (a < b) {
				return -1;
			}
			else if (b < a) {
				return 1;
			}
			else {
				return 0;
			}
		}
	};

	var defaultValueEqualityComparer = collectionjs.newEqualityComparer();
	var createEntry = function(key, value) {
		return {
		    key : key,
		    value : value,
		    toString : function() {
			    return key + ' = ' + value;
		    }
		};
	};

	// Almost all of the following red-black tree functions are based on the
	// algorithms from chapters 12 and 13 of the book "Introduction to
	// Algorithms" (Second Edition) by Thomas H. Cormen, Charles E. Leiserson,
	// Ronald L. Rivest, and Clifford Stein.

	// Color constants for our red-black tree
	/**
	 * @const
	 */
	var RED = "red";
	/**
	 * @const
	 */
	var BLACK = "black";

	// Rotate direction constants
	/**
	 * @const
	 */
	var LEFT = "left";
	/**
	 * @const
	 */
	var RIGHT = "right";

	// We don't use null, we use a sentinel. Deal with it.
	var sentinel = {
		color : BLACK
	};
	sentinel.left = sentinel;
	sentinel.right = sentinel;
	sentinel.parent = sentinel;

	// Creates a new node with the given key and value
	var createNode = function(key, value) {
		return {
		    key : key,
		    value : value
		};
	};

	var treeMinimum = function(tree, x) {
		while (x.left !== sentinel) {
			x = x.left;
		}
		return x;
	};

	var treeSuccessor = function(tree, x) {
		if (x.right !== sentinel) {
			return treeMinimum(tree, x.right);
		}
		var y = x.parent;
		while (y !== sentinel && x === y.right) {
			x = y;
			y = y.parent;
		}
		return y;
	};

	var iterativeTreeSearch = function(x, k, compareFunction) {
		while (x !== sentinel && k !== x.key) {
			if (compareFunction(k, x.key) < 0) {
				x = x.left;
			}
			else {
				x = x.right;
			}
		}
		return x;
	};

	// Rotates the tree node x with one of its children.
	// child1 indicates the direction of the rotation (LEFT for a left
	// rotation and RIGHT for a right rotation) and child2 must always be set to
	// the opposite direction.
	// Both values must be passed in just to avoid any extra work on every
	// rotate operation and there is no sanity checking (since this is an
	// internal method).
	var rbRotate = function(tree, x, child1, child2) {
		// Set y.
		var y = x[child2];

		// Turn y's child1 subtree into x's child2 subtree.
		x[child2] = y[child1];
		if (y[child1] !== sentinel) {
			y[child1].parent = x;
		}

		// Link x's parent to y.
		y.parent = x.parent;
		if (x.parent === sentinel) {
			tree.root = y;
		}
		else if (x === x.parent[child1]) {
			x.parent[child1] = y;
		}
		else {
			x.parent[child2] = y;
		}

		// Put x as y's child1 subtree.
		y[child1] = x;
		x.parent = y;
	};

	// Performs one iteration of the rbInsertFixup procedure.
	var rbInsertFixupIteration = function(tree, z, child1, child2) {
		var y = z.parent.parent[child2];
		if (y.color === RED) {
			z.parent.color = BLACK;
			y.color = BLACK;
			z.parent.parent.color = RED;
			z = z.parent.parent;
		}
		else {
			if (z === z.parent[child2]) {
				z = z.parent;
				rbRotate(tree, z, child1, child2);
			}
			z.parent.color = BLACK;
			z.parent.parent.color = RED;
			rbRotate(tree, z.parent.parent, child2, child1);
		}
	};

	// Fixes the red-black tree after the insertion of node z.
	var rbInsertFixup = function(tree, z) {
		while (z.parent.color === RED) {
			if (z.parent === z.parent.parent.left) {
				rbInsertFixupIteration(tree, z, LEFT, RIGHT);
			}
			else {
				rbInsertFixupIteration(tree, z, RIGHT, LEFT);
			}
		}
		tree.root.color = BLACK;
	};

	// Inserts node z into the tree and fixes any resulting red-black constraint
	// violations.
	var rbInsert = function(tree, z, compareFunction) {
		var y = sentinel;
		var x = tree.root;
		while (x !== sentinel) {
			y = x;

			var compareResult = compareFunction(z.key, x.key);
			if (compareResult < 0) {
				x = x.left;
			}
			else if (compareResult > 0) {
				x = x.right;
			}
			else {
				var oldValue = x.value;
				x.value = z.value;
				return oldValue;
			}
		}
		z.parent = y;
		if (y === sentinel) {
			tree.root = z;
		}
		else if (compareFunction(z.key, y.key) < 0) {
			y.left = z;
		}
		else {
			y.right = z;
		}
		z.left = sentinel;
		z.right = sentinel;
		z.color = RED;
		rbInsertFixup(tree, z);
	};

	// Performs one iteration of the deleteFixup procedure.
	var rbDeleteFixupIteration = function(tree, x, child1, child2) {
		var w = x.parent[child2];
		if (w.color === RED) {
			w.color = BLACK;
			x.parent.color = RED;
			rbRotate(tree, x.parent, child1, child2);
			w = x.parent[child2];
		}

		if (w[child1].color === BLACK && w[child2].color === BLACK) {
			w.color = RED;
			x = parent.x;
		}
		else {
			if (w[child2].color === BLACK) {
				w[child1].color = BLACK;
				w.color = RED;
				rbRotate(tree, w, child2, child1);
				w = x.parent[child2];
			}
			w.color = x.parent.color;
			x.parent.color = BLACK;
			w[child2].color = BLACK;
			rbRotate(tree, x.parent, child1, child2);
			x = tree.root;
		}
	};

	var rbDeleteFixup = function(tree, x) {
		while (x !== tree.root && x.color === BLACK) {
			if (x === x.parent.left) {
				rbDeleteFixupIteration(tree, x, LEFT, RIGHT);
			}
			else {
				rbDeleteFixupIteration(tree, x, RIGHT, LEFT);
			}
		}
		x.color = BLACK;
	};

	var rbDelete = function(tree, z) {
		var y;
		if (z.left === sentinel || z.right === sentinel) {
			y = z;
		}
		else {
			y = treeSuccessor(tree, z);
		}

		if (y.left !== sentinel) {
			x = y.left;
		}
		else {
			x = y.right;
		}

		if (x !== sentinel) {
			x.parent = y.parent;
		}

		if (y.parent === sentinel) {
			tree.root = x;
		}
		else if (y === y.parent.left) {
			y.parent.left = x;
		}
		else {
			y.parent.right = x;
		}

		if (y !== z) {
			z.key = y.key;
			z.value = y.value;
		}

		if (y.color === BLACK) {
			rbDeleteFixup(tree, x);
		}
		return y;
	};

	/**
	 * 
	 */
	collectionjs.newTreeMap = function() {
		var options = createMapIterableOptions(arguments, {
		    keyComparer : defaultComparer,
		    valueEqualityComparer : defaultValueEqualityComparer
		});

		var keyComparer = options.keyComparer;
		if (!isComparer(keyComparer)) {
			throw new TypeError('options.keyComparer is not a comparer');
		}

		var keyEqualityComparer = collectionjs.newEqualityComparer( {
			equals : function(a, b) {
				return keyComparer.compare(a, b) === 0;
			}
		});

		var valueEqualityComparer = options.valueEqualityComparer;
		if (!collectionjs.isEqualityComparer(valueEqualityComparer)) {
			throw new TypeError(
			        'options.valueEqualityComparer is not an equalityComparer');
		}

		var tree = {
		    root : sentinel
		};

		var size = 0;
		var treeMap = {
		    keyComparer : function() {
			    return keyComparer;
		    },
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
			    var nextNode = treeMinimum(tree, tree.root);
			    var lastReturnedNode = sentinel;

			    return {
			        hasNext : function() {
				        return nextNode !== sentinel;
			        },
			        next : function() {
				        if (nextNode === sentinel) {
					        throw new RangeError("There is no next element");
				        }

				        lastReturnedNode = nextNode;
				        nextNode = treeSuccessor(tree, nextNode);
				        return lastReturnedNode.key;
			        },
			        getKey : function() {
				        if (lastReturnedNode === sentinel) {
					        throw new Error("There is no current entry.");
				        }
				        return lastReturnedNode.key;
			        },
			        getValue : function() {
				        if (lastReturnedNode === sentinel) {
					        throw new Error("There is no current entry.");
				        }
				        return lastReturnedNode.value;
			        },
			        setValue : function(value) {
				        if (lastReturnedNode === sentinel) {
					        throw new Error("There is no current entry.");
				        }

				        if (typeof value === 'undefined') {
					        throw new ReferenceError('value');
				        }

				        lastReturnedNode.value = value;
			        },
			        remove : function() {
				        if (lastReturnedNode === sentinel) {
					        throw new Error("There is nothing to remove.");
				        }
				        rbDelete(tree, lastReturnedNode);
				        lastReturnedNode = sentinel;
				        size--;
			        }
			    };
		    },
		    get : function(key) {
			    if (typeof key === 'undefined') {
				    throw new ReferenceError('key');
			    }
			    var node = iterativeTreeSearch(tree.root, key,
			            keyComparer.compare);
			    if (node !== sentinel) {
				    return node.value;
			    }
		    },
		    put : function(key, value) {
			    if (typeof key === 'undefined') {
				    throw new ReferenceError('key');
			    }

			    // Our current oldValue check below depends on this not being
			    // undefined
			    if (typeof value === 'undefined') {
				    throw new ReferenceError('value');
			    }

			    var newNode = createNode(key, value);
			    var oldValue = rbInsert(tree, newNode, keyComparer.compare);
			    if (typeof oldValue === 'undefined') {
				    size++;
			    }
			    return oldValue;
		    },
		    remove : function(key) {
			    if (typeof key === 'undefined') {
				    throw new ReferenceError('key');
			    }

			    var node = iterativeTreeSearch(tree.root, key,
			            keyComparer.compare);
			    if (node !== sentinel) {
				    var oldValue = node.value;
				    rbDelete(tree, node);
				    size--;
				    return oldValue;
			    }
		    }
		};

		treeMap = collectionjs.newAbstractMap(treeMap);

		// Now that the map is fully defined we can add any initial values
		if (options.mapIterable) {
			treeMap.putAll(options.mapIterable);
		}

		return treeMap;
	};
}(collectionjs, collectionjs.__transporter__));