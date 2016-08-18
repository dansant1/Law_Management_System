Meteor.publish('invitacion', function (invitacionId) {

	check(invitacionId,  String);

	if (this.userId) {
		return Invitados.find({_id: invitacionId});
	} else {
		this.stop();
		return;
	}

});