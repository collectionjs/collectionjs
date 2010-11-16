var createListTests = function(options) {
	var defaultOptions = {
			data: [1, 2, 3, 4, 5]	
	};
	options = testUtil.extend(defaultOptions, options);
	
	var data = options.data;

	var tests = {
		get : function(constructorFunction) {
			var c = constructorFunction( [ data[0], data[1], data[2] ]);
			equals(c.get(0), data[0]);
			equals(c.get(1), data[1]);
			equals(c.get(2), data[2]);
		},

		getNegativeIndex : function(constructorFunction) {
			var c = constructorFunction( [ 1, 2, 3 ]);
			try {
				c.get(-1);
			    ok(false, "did not throw error");
		    }
		    catch (expected) {
			    ok(expected instanceof RangeError, "expected RangeError");
		    }
		},

		getOutOfRangeEmptyList: function(constructorFunction) {
			var c = constructorFunction();
			try {
				c.get(0);
			    ok(false, "did not throw error");
		    }
		    catch (expected) {
			    ok(expected instanceof RangeError, "expected RangeError");
		    }
		},

		getOutOfRange : function(constructorFunction) {
			var c = constructorFunction( [ 1, 2, 3 ]);
			try {
				c.get(3);
			    ok(false, "did not throw error");
		    }
		    catch (expected) {
			    ok(expected instanceof RangeError, "expected RangeError");
		    }
		},
		
		indexOf: function(constructorFunction) {
			var list = constructorFunction( [ 2, 22, 22, 222, 22, 2222]);
			equals(list.indexOf(2), 0);
			equals(list.indexOf(22), 1);
			equals(list.indexOf(2222), 5);
			equals(list.indexOf(1), -1);
		}, 
		
		lastIndexOf: function(constructorFunction) {
			var list = constructorFunction( [ 2, 22, 22, 222, 22, 2222]);
			equals(list.lastIndexOf(2), 0);
			equals(list.lastIndexOf(22), 4);
			equals(list.lastIndexOf(2222), 5);
			equals(list.indexOf(1), -1);
		}, 
			
		listIterator : function(constructorFunction) {
			var list = constructorFunction( [ 1, 2, 3 ]);
			var iter = list.listIterator();
		
			equals(iter.hasPrevious(), false);
			equals(iter.hasNext(), true);
			equals(iter.next(), 1);
		
			equals(iter.hasNext(), true);
			equals(iter.next(), 2);
		
			equals(iter.hasNext(), true);
			equals(iter.next(), 3);
		
			equals(iter.hasNext(), false);
			equals(iter.hasPrevious(), true);
		},
		
		listIteratorNextIndex : function(constructorFunction) {
			var list = constructorFunction( [ 1, 2, 3 ]);
			var iter = list.listIterator();

			equals(iter.nextIndex(), 0);
			iter.next();
			equals(iter.nextIndex(), 1);
			iter.next();
			equals(iter.nextIndex(), 2);
			iter.next();
			equals(iter.nextIndex(), 3);
		},
		
		listIteratorPreviousIndex : function(constructorFunction) {
			var list = constructorFunction( [ 1, 2, 3 ]);
			var iter = list.listIterator();

			equals(iter.previousIndex(), -1);
			iter.next();
			equals(iter.previousIndex(), 0);
			iter.next();
			equals(iter.previousIndex(), 1);
			iter.next();
			equals(iter.previousIndex(), 2);
		},
		
		listIteratorBackward : function(constructorFunction) {
			var list = constructorFunction( [ 1, 2, 3 ]);
			var iter = list.listIterator(3);
		
			equals(iter.hasNext(), false);
			equals(iter.hasPrevious(), true);
			equals(iter.previous(), 3);
		
			equals(iter.hasPrevious(), true);
			equals(iter.previous(), 2);
		
			equals(iter.hasPrevious(), true);
			equals(iter.previous(), 1);

		    equals(iter.hasPrevious(), false);
		    equals(iter.hasNext(), true);
	    },
	    
	    listIteratorNextIndexBackwards : function(constructorFunction) {
	    	var list = constructorFunction( [ 1, 2, 3 ]);
			var iter = list.listIterator(3);

			equals(iter.nextIndex(), 3);
			iter.previous();
			equals(iter.nextIndex(), 2);
			iter.previous();
			equals(iter.nextIndex(), 1);
			iter.previous();
			equals(iter.nextIndex(), 0);
		},
		
		listIteratorPreviousIndexBackwards : function(constructorFunction) {
			var list = constructorFunction( [ 1, 2, 3 ]);
			var iter = list.listIterator(3);

			equals(iter.previousIndex(), 2);
			iter.previous();
			equals(iter.previousIndex(), 1);
			iter.previous();
			equals(iter.previousIndex(), 0);
			iter.previous();
			equals(iter.previousIndex(), -1);
		},

	    listIteratorEmptyList : function(constructorFunction) {
		    var list = constructorFunction();

		    var iter = list.listIterator();
		    equals(iter.hasNext(), false);
	    },

	    listIteratorOneElementList : function(constructorFunction) {
		    var list = constructorFunction( [ 2 ]);

		    var iter = list.listIterator();
		    equals(iter.next(), 2);
		    equals(iter.hasNext(), false);
	    },

	    listIteratorBeforeStart : function(constructorFunction) {
		    var list = constructorFunction( [ 1, 2, 3 ]);
		    try {
			    list.listIterator(-1);
			    ok(false, "error was not thrown");
		    }
		    catch (expected) {
			    ok(expected instanceof RangeError, 'expected RangeError');
		    }
	    },
		
		listIteratorStartIndexZero : function(constructorFunction) {
			var list = constructorFunction( [ 1, 2, 3]);
			var iter = list.listIterator(0);
		
			equals(iter.next(), 1);
			equals(iter.next(), 2);
			equals(iter.next(), 3);
			equals(iter.hasNext(), false);
		},
		
		listIteratorStartIndexMiddle : function(constructorFunction) {
			var list = constructorFunction( [ 1, 2, 3]);
			
			var iter = list.listIterator(1);
			equals(iter.next(), 2);
			equals(iter.next(), 3);
			equals(iter.hasNext(), false);
			
			var iter = list.listIterator(1);
			equals(iter.previous(), 1);
			equals(iter.hasPrevious(), false);
		},
		
		listIteratorStartIndexEnd : function(constructorFunction) {
			var list = constructorFunction( [ 1, 2, 3]);
			
			var iter = list.listIterator(3);
			equals(iter.hasNext(), false);
			equals(iter.previous(), 3);
			equals(iter.previous(), 2);
			equals(iter.previous(), 1);
			equals(iter.hasPrevious(), false);
		}, 
		
		listIteratorAfterEnd : function(constructorFunction) {
		    var list = constructorFunction( [ 1, 2, 3 ]);

		    try {
			    list.listIterator(4);
			    ok(false, "error was not thrown");
		    }
		    catch (expected) {
			    ok(expected instanceof RangeError, 'expected RangeError');
		    }
	    }
	};
	
	
	var modifiableTests = {
			setFirst : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				equals(list.get(0), 1);
				list.set(0, 2);
				equals(list.get(0), 2);
			}, 
			
			setMiddle : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				equals(list.get(1), 2);
				list.set(1, 22);
				equals(list.get(1), 22);
			}, 
			
			setEnd : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				equals(list.get(2), 3);
				list.set(2, 2);
				equals(list.get(2), 2);
			}, 
			
			setAfterEnd : function(constructorFunction) {
			    var list = constructorFunction( [ 1, 2, 3 ]);
			    try {
				    list.set(3, 22);
				    ok(false, "error was not thrown");
			    }
			    catch (expected) {
				    ok(expected instanceof RangeError, "expected RangeError was " + expected.name);
			    }
		    },
		    
		    addAll : function(constructorFunction) {
			    if (typeof constructorFunction().addAll !== 'function'
			            && typeof constructorFunction().add !== 'function') {
				    ok(true, "not tested because this is an optional method");
				    return;
			    }
			    
			  
			    var list = constructorFunction( [ 1, 2 ]);
			    var a = [ 22, 4 ];

			    list.addAll(a);
			    
			    var iter = list.iterator();
			    equals(1, iter.next());
			    equals(2, iter.next());
			    equals(22, iter.next());
			    equals(4, iter.next());
			    equals(false, iter.hasNext());
		    },

			addAt : function(constructorFunction) {
				var list = constructorFunction( [ 1 ]);

				list.addAt(0, 3);
				var iter = list.iterator();
				equals(iter.next(), 3);
				equals(iter.next(), 1);
				equals(iter.hasNext(), false);
				
				list.addAt(2, 22);
				var iter = list.iterator();
				equals(iter.next(), 3);
				equals(iter.next(), 1);
				equals(iter.next(), 22);
				equals(iter.hasNext(), false);
				
				list.addAt(2, 2);
				var iter = list.iterator();
				equals(iter.next(), 3);
				equals(iter.next(), 1);
				equals(iter.next(), 2)
				equals(iter.next(), 22);
				equals(iter.hasNext(), false);
			},

			addAllAtIterableStart : function(constructorFunction) {
				var c1 = constructorFunction([1,2]);
				var c2 = constructorFunction([3]);

				c1.addAllAt(0, c2);

				var iter = c1.iterator();
				equals(iter.next(), 3);
				equals(iter.next(), 1);
				equals(iter.next(), 2);
				equals(iter.hasNext(), false);

				var iter = c2.iterator();
				equals(iter.next(), 3);
				equals(iter.hasNext(), false);
			},

			addAllAtIterableMiddle : function(constructorFunction) {
				var c1 = constructorFunction([1,2]);
				var c2 = constructorFunction([3]);

				c1.addAllAt(1, c2);

				var iter = c1.iterator();
				equals(iter.next(), 1);
				equals(iter.next(), 3);
				equals(iter.next(), 2);
				equals(iter.hasNext(), false);

				var iter = c2.iterator();
				equals(iter.next(), 3);
				equals(iter.hasNext(), false);
			},
			
			addAllAtIterableEnd : function(constructorFunction) {
				var c1 = constructorFunction([1,2]);
				var c2 = constructorFunction([3]);

				c1.addAllAt(2, c2);

				var iter = c1.iterator();
				equals(iter.next(), 1);
				equals(iter.next(), 2);
				equals(iter.next(), 3);
				equals(iter.hasNext(), false);

				var iter = c2.iterator();
				equals(iter.next(), 3);
				equals(iter.hasNext(), false);
			},

			addAllAtArrayStart : function(constructorFunction) {
				var list = constructorFunction([1,2]);
				var array = [3];

				list.addAllAt(0, array);

				var iter = list.iterator();
				equals(iter.next(), 3);
				equals(iter.next(), 1);
				equals(iter.next(), 2);
				equals(iter.hasNext(), false);

				equals(array.length, 1);
				equals(array[0], 3);
			},

			addAllAtArrayMiddle : function(constructorFunction) {
				var list = constructorFunction([1,2]);
				var array = [3];

				list.addAllAt(1, array);

				var iter = list.iterator();
				equals(iter.next(), 1);
				equals(iter.next(), 3);
				equals(iter.next(), 2);
				equals(iter.hasNext(), false);

				equals(array.length, 1);
				equals(array[0], 3);
			},
			
			addAllAtArrayEnd : function(constructorFunction) {
				var list = constructorFunction([1,2]);
				var array = [3];

				list.addAllAt(2, array);

				var iter = list.iterator();
				equals(iter.next(), 1);
				equals(iter.next(), 2);
				equals(iter.next(), 3);
				equals(iter.hasNext(), false);

				equals(array.length, 1);
				equals(array[0], 3);
			},
			
			removeAt : function(constructorFunction) {
				var a = constructorFunction([1, 2, 3]);

				equals(a.size(), 3);

				a.removeAt(0);

				equals(a.size(), 2);
				
				var iter = a.iterator();
				equals(iter.next(), 2);
				equals(iter.next(), 3);
				equals(iter.hasNext(), false);
			}, 
			
			listIteratorRemove : function(constructorFunction) {
			    var list = constructorFunction( [ 1, 2, 3 ]);

			    var iter = list.listIterator();
			
				equals(iter.next(), 1);
				iter.remove();

				equals(iter.next(), 2);
				equals(iter.next(), 3);
				iter.remove();
			
				equals(iter.hasNext(), false);
			
				var iter = list.iterator();
				equals(iter.next(), 2);
				iter.remove();
			
				equals(iter.hasNext(), false);
			},
			
			listIteratorRemoveBeforeNext : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator();
				
				try {
					iter.remove();
				    ok(false, "did not throw error");
			    }
			    catch (expected) {
				    ok(expected instanceof Error, "expected Error");
			    }
			},
			
			listIteratorRemoveTwiceAfterNext : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator();
				
				equals(iter.next(), 1);
				iter.remove();

				try {
					iter.remove();
				    ok(false, "did not throw error");
			    }
			    catch (expected) {
				    ok(expected instanceof Error, "expected Error");
			    }
			}, 

			listIteratorNextIndexAfterRemove : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator();

				equals(iter.nextIndex(), 0);
				
				iter.next();
				equals(iter.nextIndex(), 1);
				
				iter.remove();
				equals(iter.nextIndex(), 0);
				
				iter.next();
				equals(iter.nextIndex(), 1);
				
				iter.next();
				equals(iter.nextIndex(), 2);
				
				iter.remove();
				equals(iter.nextIndex(), 1);
				
				var iter = list.listIterator();
				iter.next();
				equals(iter.nextIndex(), 1);
				
				iter.remove();
				equals(iter.nextIndex(), 0);
			},
			
			listIteratorNextIndexAfterRemoveBackwards : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator(3);

				equals(iter.nextIndex(), 3);
				
				iter.previous();
				equals(iter.nextIndex(), 2);
				
				iter.remove();
				equals(iter.nextIndex(), 2);
				
				iter.previous();
				equals(iter.nextIndex(), 1);
				
				iter.previous();
				equals(iter.nextIndex(), 0);
				
				iter.remove();
				equals(iter.nextIndex(), 0);
				
				var iter = list.listIterator(1);
				iter.previous();
				equals(iter.nextIndex(), 0);
				
				iter.remove();
				equals(iter.nextIndex(), 0);
			},
			
			listIteratorPreviousIndexAfterRemove : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator();

				equals(iter.previousIndex(), -1);
				
				iter.next();
				equals(iter.previousIndex(), 0);
				
				iter.remove();
				equals(iter.previousIndex(), -1);
				
				iter.next();
				equals(iter.previousIndex(), 0);
				
				iter.next();
				equals(iter.previousIndex(), 1);
				
				iter.remove();
				equals(iter.previousIndex(), 0);
				
				var iter = list.listIterator();
				iter.next();
				equals(iter.previousIndex(), 0);
				
				iter.remove();
				equals(iter.previousIndex(), -1);
			},
			
			listIteratorPreviousIndexAfterRemoveBackwards : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator(3);

				equals(iter.previousIndex(), 2);
				
				iter.previous();
				equals(iter.previousIndex(), 1);
				
				iter.remove();
				equals(iter.previousIndex(), 1);
				
				iter.previous();
				equals(iter.previousIndex(), 0);
				
				iter.previous();
				equals(iter.previousIndex(), -1);
				
				iter.remove();
				equals(iter.previousIndex(), -1);
				
				var iter = list.listIterator(1);
				iter.previous();
				equals(iter.previousIndex(), -1);
				
				iter.remove();
				equals(iter.previousIndex(), -1);
			},
			
			listIteratorAdd : function(constructorFunction) {
			    var list = constructorFunction( []);
			    var iter = list.listIterator();
			
			    iter.add(2);
			    equals(iter.hasNext(), false);

				equals(iter.previous(), 2);
				equals(iter.hasPrevious(), false);

				iter.add(1);
				equals(iter.next(), 2);
				equals(iter.hasNext(), false);
				
				iter.add(3);
				equals(iter.hasNext(), false);
				equals(iter.previous(), 3);
				equals(iter.previous(), 2);
				equals(iter.previous(), 1);
				equals(iter.hasPrevious(), false);
			},
			
			listIteratorNextIndexAfterAdd : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator();

				equals(iter.nextIndex(), 0);
				
				iter.next();
				equals(iter.nextIndex(), 1);
				
				iter.add(22);
				equals(iter.nextIndex(), 2);
				
				iter.next();
				equals(iter.nextIndex(), 3);
				
				iter.next();
				equals(iter.nextIndex(), 4);
				
				iter.add(222);
				equals(iter.nextIndex(), 5);
			},
			
			listIteratorNextIndexAfterAddBackwards : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator(3);

				equals(iter.nextIndex(), 3);
				
				iter.previous();
				equals(iter.nextIndex(), 2);
				
				iter.add(22);
				equals(iter.nextIndex(), 3);
				
				iter.previous();
				equals(iter.nextIndex(), 2);
				
				iter.previous();
				equals(iter.nextIndex(), 1);
				
				iter.add(222);
				equals(iter.nextIndex(), 2);
			}, 
			
			listIteratorPreviousIndexAfterAdd : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator();

				equals(iter.previousIndex(), -1);
				
				iter.next();
				equals(iter.previousIndex(), 0);
				
				iter.add(22);
				equals(iter.previousIndex(), 1);
				
				iter.next();
				equals(iter.previousIndex(), 2);
				
				iter.next();
				equals(iter.previousIndex(), 3);
				
				iter.add(222);
				equals(iter.previousIndex(), 4);
			},
			
			listIteratorPreviousIndexAfterAddBackwards : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator(3);

				equals(iter.previousIndex(), 2);
				
				iter.previous();
				equals(iter.previousIndex(), 1);
				
				iter.add(22);
				equals(iter.previousIndex(), 2);
				
				iter.previous();
				equals(iter.previousIndex(), 1);
				
				iter.previous();
				equals(iter.previousIndex(), 0);
				
				iter.add(222);
				equals(iter.previousIndex(), 1);
			}, 

		    listIteratorSet : function(constructorFunction) {
			    var list = constructorFunction( [ 1, 2, 3 ]);
			    var iter = list.listIterator();

			    equals(iter.next(), 1);
			    iter.set(22);

			    var newIter = list.iterator();
			    equals(newIter.next(), 22);
			    equals(newIter.next(), 2);

			    equals(iter.next(), 2);
			    equals(iter.next(), 3);
			    iter.set(222);

			    var newIter = list.iterator();
			    equals(newIter.next(), 22);
			    equals(newIter.next(), 2);
			    equals(newIter.next(), 222);
			    equals(newIter.hasNext(), false);

			    equals(newIter.hasNext(), false);
			    equals(iter.previous(), 222);
		    }, 
		    
		    listIteratorNextIndexAfterSet : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator();

				equals(iter.nextIndex(), 0);
				
				iter.next();
				equals(iter.nextIndex(), 1);
				
				iter.set(22);
				equals(iter.nextIndex(), 1);
				
				iter.next();
				equals(iter.nextIndex(), 2);
				
				iter.next();
				equals(iter.nextIndex(), 3);
				
				iter.set(222);
				equals(iter.nextIndex(), 3);
			},
			
			listIteratorNextIndexAfterSetBackwards : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator(3);

				equals(iter.nextIndex(), 3);
				
				iter.previous();
				equals(iter.nextIndex(), 2);
				
				iter.set(22);
				equals(iter.nextIndex(), 2);
				
				iter.previous();
				equals(iter.nextIndex(), 1);
				
				iter.previous();
				equals(iter.nextIndex(), 0);
				
				iter.set(222);
				equals(iter.nextIndex(), 0);
			}, 
			
			listIteratorPreviousIndexAfterSet : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator();

				equals(iter.previousIndex(), -1);
				
				iter.next();
				equals(iter.previousIndex(), 0);
				
				iter.set(22);
				equals(iter.previousIndex(), 0);
				
				iter.next();
				equals(iter.previousIndex(), 1);
				
				iter.next();
				equals(iter.previousIndex(), 2);
				
				iter.set(222);
				equals(iter.previousIndex(), 2);
			},
			
			listIteratorPreviousIndexAfterSetBackwards : function(constructorFunction) {
				var list = constructorFunction( [ 1, 2, 3 ]);
				var iter = list.listIterator(3);

				equals(iter.previousIndex(), 2);
				
				iter.previous();
				equals(iter.previousIndex(), 1);
				
				iter.set(22);
				equals(iter.previousIndex(), 1);
				
				iter.previous();
				equals(iter.previousIndex(), 0);
				
				iter.previous();
				equals(iter.previousIndex(), -1);
				
				iter.set(222);
				equals(iter.previousIndex(), -1);
			}
		};

	return testUtil.extend(tests, modifiableTests);
};

var createSubListTests;
(function() {
	var createSubListCallback = function(prefix, testObject) {
		return function(key, testFunction) {
			testObject[prefix + " " + key] = function(constructorFunction) {
				var newConstructorFunction = function(iterableOrArray, options) {
					var array = [];
					if (testUtil.isArray(iterableOrArray)) {
						array = iterableOrArray;
					}
					else if (collectionjs.isIterable(iterableOrArray)) {
						var toArray = function() {
							var array = [];

							var iter = this.iterator();
							while (iter.hasNext()) {
								var e = iter.next();
								array.push(e);
							}

							return array;
						};
						array = toArray.call(iterableOrArray);
					}

					var prefixArray = [ 2, 2, 2, 2 ];
					var suffixArray = [ 2, 2, 2 ];
					var joinedArray = prefixArray.concat(array, suffixArray);

					return constructorFunction(joinedArray, options).subList(
					        prefixArray.length,
					        joinedArray.length - suffixArray.length);
				};
				testFunction.call(this, newConstructorFunction);
			};
		};
	};
	
	createSubListTests = function(options) {
		var tests = {};

		testUtil.each(createIterableTests(options), createSubListCallback("iterable", tests));
		testUtil.each(createCollectionTests(options), createSubListCallback("collection", tests));
		testUtil.each(createListTests(options), createSubListCallback("list", tests));

		return tests;
	};
})();