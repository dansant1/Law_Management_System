Meteor.publish('TareasGantt', function () {
	// return TasksCollection.find({
	// 	parent:{$exists:true},
	// 	duration:{$exists:true},
	// 	start_date:{$exists:true},
	// 	end_date:{$exists:true}
	// });

	return TasksCollection.find();
});

Meteor.publish('LinksGantt', function () {
	return LinksCollection.find();
});
