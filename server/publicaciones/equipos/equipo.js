Meteor.publish('equipo', function (bufeteId) {
	
	check(bufeteId, String);

	if (this.userId) {
		return Meteor.users.find( { "profile.bufeteId": bufeteId }, { fields: { "profile.nombre": 1, "profile.apellido": 1} } );
	} else {
		this.stop();
		return;
	}

});