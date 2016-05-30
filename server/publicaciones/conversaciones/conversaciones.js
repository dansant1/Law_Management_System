Meteor.publish('conversaciones', function (bufeteId) {
	check(bufeteId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return Conversaciones.find({bufeteId: bufeteId});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('conversacionesAsunto', function (asuntoId) {
	check(asuntoId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return ConversacionesAsunto.find({asuntoId: asuntoId});
	} else {
		this.stop();
		return;
	}

});

Meteor.publish('conversacionesNota', function (contactoId, bufeteId) {
	check(contactoId, String);
	check(bufeteId, String);

	if (  Roles.userIsInRole( this.userId, ['administrador'], 'bufete' ) || Roles.userIsInRole( this.userId, ['abogado'], 'bufete' )  ) {
		return ConversacionesNota.find({contactoId: contactoId, bufeteId: bufeteId});
	} else {
		this.stop();
		return;
	}

});