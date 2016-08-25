Meteor.publish('invitacion', function (invitacionId) {

	check(invitacionId,  String);

	
	return Invitados.find({_id: invitacionId});
	

});