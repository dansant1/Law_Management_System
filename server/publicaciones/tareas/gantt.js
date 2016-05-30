Meteor.publish('TareasGantt', function () {
	return TasksCollection.find();
});

Meteor.publish('LinksGantt', function () {
	return LinksCollection.find();
});