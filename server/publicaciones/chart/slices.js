Meteor.publish('slices', function () {
	return Slices.find({});
});

Meteor.publish('bars', function () {
	return Bars.find({});
});