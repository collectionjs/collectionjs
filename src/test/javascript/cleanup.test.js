(function() {
	module("cleanup");

	test("collectionjs.__transporter__ does not exist", function() {
		equals(typeof collectionjs.__transporter__, 'undefined');
	});
})();